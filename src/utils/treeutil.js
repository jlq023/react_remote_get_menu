import { isUrl } from '../utils/utils';
export function jsonToTreeJson(json, rootId) {
    let treeJson = [];
    rootId = rootId ? rootId : '1';
    // 先找到第一层后开始递归
    for (let i = 0; i < json.length; i++) {
      if (json[i].parentId == rootId && json[i].isShow == '1') {
        json[i].key = json[i].id;
        json[i].url = json[i].href;
        if(json[i].href){
          json[i].path = json[i].href;
        }else{
          json[i].path = json[i].id;
        }
        findChildrenByPId(json, json[i]);
        treeJson.push(json[i]);
      }
    }
    return treeJson;
  };

  function findChildrenByPId(json, obj) {
    let children = [];
    for (let i = 0; i < json.length; i++) {
      if (json[i].parentId == obj.id && json[i].isShow == '1') {
        json[i].key = json[i].id;
        json[i].url = json[i].href;
        if(json[i].href){
          json[i].path = json[i].href;
        }else{
          json[i].path = json[i].id;
        }
        json[i].parentName = obj.name;
        findChildrenByPId(json, json[i]);
        children.push(json[i]);
      }
    }
    if (children.length > 0) {
      obj.child = children;
      obj.children = children;
      obj.routes = children;
    }
  }

  export let findMenuByUrl = (menus, url) => {
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].href == url) {
        menus[i].parent = findParentByPId(menus, menus[i].parentId);
        if(menus[i].href){
          menus[i].path = menus[i].href;
        }else{
          menus[i].path = menus[i].id;
        }
        return menus[i];
      }
    }
    return null;
  }

  function findParentByPId(menus, pid) {
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].id == pid) {
        if (menus[i].parentId != 1) {
          menus[i].parent = findParentByPId(menus, menus[i].parentId);
          if(menus[i].href){
            menus[i].path = menus[i].href;
          }else{
            menus[i].path = menus[i].id;
          }
        }
        return menus[i];
      }
    }
    return {};
  }

  export  function formatter(data, parentPath = '/', parentAuthority) {
    return data.map((item) => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      const result = {
        ...item,
        path,
        authority: item.authority || parentAuthority,
      };
      if (item.children) {
        result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
      }
      return result;
    });
  }

/**
 * 通过浏览器url，得到该url最顶层数据
 * */  
export function getParentId(data, url, ) {
  let curData, result;
  data.forEach(element => {
    if (element.path == url) {
      curData = element;
      result = getParentData(data, element);
    }
  });
  //console.log("treeUtil result3:",result);
  return result;
}

function getParentData(data, curData) {
  let tempData = {};
  data.forEach(element => {
    if (element.id == curData.parentId) {
      tempData = element;
      if (element.parentId && element.parentId > 0) {
        tempData = getParentData(data, element);
      }
    }
  });
 // console.log("treeUtil getParentData:", tempData, ",curData:", curData);
  return tempData;
}

/**
 * 根据顶部菜单下标，得到该菜单下,应该打开的网页Url
 * 
*/
export function getChiledByMenuIndex(data){
  if(!data||data.length==0||!data[0].child){
    return null; 
  }
  const firstChild = data[0].child; 
  let result =  getFirstChild(firstChild);
  console.log("treeUtil  getChiledUrl  :",result);
  return result;
}


function getFirstChild(data){
  let result={};
  data.forEach(function(value,index,parData){
    if(index==0){
      result = value;
      if(!value.child){
        return result;
      }
      result = getFirstChild(value.child[0]);
    }
  });
  console.log("treeUtil  getFirstChild  :",result);
  return result;
}