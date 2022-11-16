import * as dotenv from 'dotenv';

export function getEnvProperty(property: string) {
    return process.env[property] ||
        dotenv.config().parsed[property];
}