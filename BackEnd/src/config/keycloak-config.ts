import { MemoryStore } from 'express-session'
import Keycloak from 'keycloak-connect'

let _keycloak: Keycloak.Keycloak;

export const initKeycloak = (memoryStore: MemoryStore) => {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        _keycloak = new Keycloak({ store: memoryStore });
        return _keycloak;
    }
}

export const getKeycloak = () => {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please call init first.');
    } 
    return _keycloak;
}
