import { Pool } from "pg";
import { ConnectionTimeoutError } from "redis";

export const databaseConfig = {
    main: {
        usuario: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME_MAIN || 'pitstop_main',
        password: process.env.DB_PASSWORD || 'Ryan.0412',
        port: parseInt(process.env.DB_PORT || '5434'), 
        max: 20,
        idleTimeoutMillis: 30000,
        ConnectionTimeoutMillis: 2000,
    },
    cliente: (companyID: string) => ({
        usuario: process.env.DB_USER || 'postgres', 
        host: process.env.DB_USER || 'localhost',
        database: `pitstop_client_${companyID}`,
        password: process.env.DB_PASSWORD || 'Ryan.0412',
        port: parseInt(process.env.DB_PORT || '5434'),
        max: 10,
        idleTimeoutMillis: 30000,
        ConnectionTimeoutMillis: 2000,
    })
};

export const mainPool = new Pool(databaseConfig.main);

const clientPools = new Map<string, Pool>();

export const getClientPool = (companyID: string): Pool | void => {
    if(!clientPools.has(companyID)) {
        const pool = new Pool(databaseConfig.cliente(companyID));
        clientPools.set(companyID, pool);
    }

    return clientPools.get(companyID)!;
};