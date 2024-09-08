import {DrizzlePostgreSQLAdapter} from "@lucia-auth/adapter-drizzle";
import {db} from "@/drizzle/db";
import {sessionTable, userTable} from "@/drizzle/schema";


const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter;
