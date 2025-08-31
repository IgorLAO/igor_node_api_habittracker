import { PoolOptions } from 'mysql2'

export const MysqlConfig: PoolOptions = {
    host: Plata.config.MYSQL_HOST ?? 'localhost:3306',
    user: Plata.config.MYSQL_USER ?? 'root',
    password: Plata.config.MYSQL_PASSWORD ?? '123',
    database: Plata.config.MYSQL_DATABASE ?? 'mysql',
    port: Plata.config.MYSQL_PORT === undefined ? undefined : +Plata.config.MYSQL_PORT,
    waitForConnections: true,
    queueLimit: 0,
    connectionLimit: 2,
}