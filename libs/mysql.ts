import { MysqlConfig } from '@@/configs/mysql'
import { PlataSql } from 'pwi-plata-type'
import { Knex } from 'knex'

export class Mysql<T extends boolean = false> extends PlataSql.Driver<T>{
    constructor(config: typeof MysqlConfig, trx?: Knex.Transaction) {
        super({
            client: 'mysql2',
            connection: {
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
                ssl: 
                    config.ssl !== undefined ? undefined 
                    : typeof config.ssl === 'string' ? undefined
                    : config.ssl
                ,
                options: {
                    useUTC: false
                }
            }
        }, (trx !== undefined) as any, trx)
    }

    /** @deprecated */
    private query(query: string, args?: any[]): PlataPromise<any[]> {
        return this.conn.raw(query, args ?? []).catch(
            err => Plata.BuildPlataError({
                errorID: 'BLMYSQLQUE001',
                msg: 'Erro ao realizar select',
                error: err?.toString()
            })
        )
    }

    public async healthCheck(): PlataPromise<[{ today: Date }]> {
        const today: PlataResult<[{ today: Date }]> = await this.conn().select(this.conn.raw('now() as today')).catch(
            err => Plata.BuildPlataError({
                errorID: 'BLMYSQLHLT001',
                msg: 'Erro ao acessar o banco de dados',
                error: err
            })
        ) as any

        return today
    }

    public async executeProcedure(procedure: string, params: MysqlProcedureParam[]): PlataPromise<any[]> {
        const query = `CALL ${procedure} (${", ?".repeat(params.length).substring(2)})`
        const queryParams = params.map(i => i.value)

        return this.conn.raw(query, queryParams).catch(
            err => Plata.BuildPlataError({
                errorID: 'BLMYSQLEXC002',
                msg: 'Erro ao execultar a procedure',
                error: err?.toString()
            })
        )
    }

    public async selectAll(table: string) {
        return this.conn.queryBuilder().select('*').from(table).catch(
            err => Plata.BuildPlataError({
                errorID: 'BLMYSQLSEL001',
                msg: 'Erro ao realizar select',
                error: err?.toString()
            })
        )
    }

    /** @deprecated */
    public async selectAllWhere(table: string, where: string, args: any[]) {
        return this.query(`SELECT * FROM ${table} WHERE ${where}`, args)
    }
}

export const newMysql = (config?: typeof MysqlConfig) => {
    return new Mysql(config ?? MysqlConfig)
}

export function getMysql(): Mysql {
    return Plata.CacheClass(newMysql)
}