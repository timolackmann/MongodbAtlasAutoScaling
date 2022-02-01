exports = function(purpose,projectId="",clusterName="",process=""){


  // Get stored credentials...
  const username = context.values.get("AtlasPublicKey");
  const password = context.values.get("AtlasPrivateKey");
  var resourcePath = '';
  
  //build path based on purpose
  switch(purpose) {
    case 'clusterInfo':
      resourcePath = "api/atlas/v1.5/groups/"+ projectId + "/clusters/"+clusterName;
      break;
    case 'metrics':
      resourcePath = "api/atlas/v1.0/groups/"+ projectId + "/processes/"+ process + "/measurements";
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