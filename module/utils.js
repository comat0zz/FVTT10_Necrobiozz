export const arrayRemove = function (arr, value) {
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}


export const genId = function() {
  return '_' + Math.random().toString(36).substr(2, 9);
}