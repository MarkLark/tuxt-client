import 'vendor';
import 'apps';
import 'dstore/redux';

let testsContext = require.context('.', true, /.spec.jsx?$/);

testsContext.keys().forEach(testsContext);