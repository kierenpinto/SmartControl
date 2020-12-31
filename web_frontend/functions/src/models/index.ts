/**
 * CRUD Models
 */

type operationType = 'create'|'read'|'update'|'delete' 
interface Operation {
    operation: operationType,
}

class Create implements Operation {
    operation: operationType = 'create'
}

class Read implements Operation {
    operation: operationType = 'read'
}

class Update implements Operation {
    operation: operationType = 'update'
}

class Delete implements Operation {
    operation: operationType = 'delete'
}
