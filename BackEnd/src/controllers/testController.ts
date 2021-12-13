import express from "express";
import { getKeycloak } from '../config/keycloak-config'

export const testController = express.Router();
const keycloak = getKeycloak()

testController.get('/anonymous', (req, res) => {
    res.json({ message: 'Hello Anonymous' });
});

testController.get('/user', keycloak.protect('user'), (req, res) => {
    res.json({ message: 'Hello User' });
});

testController.get('/admin', keycloak.protect('admin'), (req, res) => {
    res.json({ message: 'Hello Admin' });
});

const admin_user_Role = (token: any, request: any) => {
    return token.hasRole( 'admin') && token.hasRole( 'user');
  }
testController.get('/all-user', keycloak.protect(admin_user_Role), (req, res) => {
    res.json({ message: 'Hello All User' });
});