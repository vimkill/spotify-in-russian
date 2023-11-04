const mysql = require('mysql2')
const jwt = require('jsonwebtoken')

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionLimit: 15
}

const pool = mysql.createPool(config).promise()

const currency = [
    ['копейка', 'копейки', 'копеек'],
    ['рубль', 'рубля', 'рублей'],//['доллар','доллара','долларов'] или ['килограмм','килограмма','килограммов']
    ['тысяча', 'тысячи', 'тысяч'],
    ['миллион', 'миллиона', 'миллионов'],
    ['миллиард', 'миллиарда', 'миллиардов'],
    ['триллион', 'триллиона', "триллионов"],
    ['квадриллион', 'квадриллиона', "квадриллионов"]
];

const categories = [
    ['', '', ''],
    [['один', 'одна'], ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'], 'сто'],
    [['два', 'две'], 'двадцать', 'двести'],
    ['три', 'тридцать', 'триста'],
    ['четыре', 'сорок', 'четыреста'],
    ['пять', 'пятьдесят', 'пятьсот'],
    ['шесть', 'шестьдесят', 'шестьсот'],
    ['семь', 'семьдесят', 'семьсот'],
    ['восемь', 'восемьдесят', 'восемьсот'],
    ['девять', 'девяносто', 'девятьсот'],
];

function plural(n, forms) {
    return forms[n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

function m999(n, b, f) {
    let s = '';
    let t = categories[Math.floor(n / 100) % 10][2];

    if (t) s += t + ' ';

    let d = Math.floor(n / 10) % 10;
    t = categories[d][1];

    if (t instanceof Array) {
        t = t[n % 10];
        if (t) s += t + ' ';
    } else {
        if (t) s += t + ' ';

        t = categories[n % 10][0];

        if (t instanceof Array) t = t[f === 0 || f === 2 ? 1 : 0];

        if (t) s += t;
    }
    return s + ' ' + plural(n, b[f]) + (f > 1 ? ' ' : '');
}

function money2string(n) {
    let i = Math.floor(n + 0.005),
        f = Math.floor(((n - i) * 100) + 0.5),
        s = '',
        firstZero = true;

    for (let j = 1; i > 0.9999; i /= 1000) {
        const numberPart = Math.floor(i % 1000);

        if (numberPart !== 0 || (numberPart === 0 && firstZero)) {
            if (numberPart === 0) firstZero = false;

            s = m999(numberPart, currency, j) + s;
        }

        j++;
    }

    if (f > 0) s = s + ' ' + m999(f, currency, 0);

    s = s.trim();
    s = s.replace(/\s{2,}/g, ' ');
    let sFirst = s.slice(0, 1).toUpperCase();
    s = sFirst + s.substr(1);

    return s;
}

async function checkTokenAndSetRequest(request) {
    let ch = false
    const client = await pool.connect()
    try {
        const decoded = jwt.verify(request.headers.access, '12345678')
        console.log(decoded)
        request.info = decoded
        ch = true
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
    return ch
}

module.exports = {
    pool: pool,
    money2string: money2string,
    checkTokenAndSetRequest: checkTokenAndSetRequest
}

