'use strict';
/*
 *@server grpc-node-server
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});
console.log(path.resolve(process.cwd(), '.env'));
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { dbHelper } = require('./helpers');
const packageDefinition = protoLoader.loadSync('./proto/simple_crud.rpc.proto', {
  keepCase: true,
  longs: 'string',
  defaults: true,
});
const server = new grpc.Server();
const simpleProto = grpc.loadPackageDefinition(packageDefinition);
// Grpc Methods
const simpleServiceCtl = require('./modules/simple_crud');
server.addService(simpleProto.example.simple_crud.rpc.SimpleCrudService.service, {
  create: simpleServiceCtl.create,
  update: simpleServiceCtl.update,
  details:simpleServiceCtl.detials,
  list: simpleServiceCtl.list,
  delete: simpleServiceCtl.delete,
});

server.bindAsync(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.ServerCredentials.createInsecure(),()=>{
  server.start();
});


if (server.start) {
  dbHelper.init();
  console.log(`listening to port ${process.env.GRPC_PORT}, host ${process.env.GRPC_HOST}, date: ${new Date()}`);
}
