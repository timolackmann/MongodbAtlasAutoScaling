exports = async function(){
  const clusterList = context.values.get("clusterList");
  
  let results = [];
  
  for (var project of clusterList){
    for (let clusterName of project.clusterNames){
      results.push(await context.functions.execute('clusterScaling',project.projectId, clusterName));
    }
  }
  
  return results;
};