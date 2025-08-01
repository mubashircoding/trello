import {ACTION, AuditLog} from "@prisma/client";
export const generateLogMessage = (log: AuditLog) => {
    const {action, entityTitle} = log;
    switch(action ){
        case ACTION.CREATE:
            return `Created ${entityTitle.toLowerCase()} "${entityTitle}"`;
        case ACTION.UPDATE:
            return `Updated ${entityTitle.toLowerCase()} "${entityTitle}"`;
        case ACTION.DELETE:
            return `Delete ${entityTitle.toLowerCase()} "${entityTitle}"`;
        default:
            return `Unknown action ${entityTitle.toLowerCase()} "${entityTitle}"`;
     
    }
}

