export interface PoolConfig {
	connectionLimit: number; 
	host: string;
	user: string; 
	password: string;
	database: string; 
	port: number;
	timezone: string;
	supportBigNumbers: boolean;
}