exports = function(purpose,projectId=""){


  // Get stored credentials...
  const username = context.values.get("AtlasPublicKey");
  const password = context.values.get("AtlasPrivateKey");
  var resourcePath = '';
  
  //build path based on purpose
  switch(purpose) {
    case 'clusterList':
      resourcePath = "api/atlas/v1.0/groups/"+ projectId + "/clusters";
      break;
    case 'userList':
      resourcePath = "api/atlas/v1.0/groups/"+ projectId + "/databaseUsers";
      break;
    case 'projectList':
      resourcePath = "api/atlas/v1.0/groups/";
      break;
    default:
      return {'err':'missing purpose'};
  }
  
  return { 
    scheme: 'https', 
    host: 'cloud.mongodb.com', 
    path: resourcePath, 
    username: username, 
    password: password,
    digestAuth:true
  };
};