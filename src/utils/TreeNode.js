import { observable,makeObservable,action} from "mobx"

class Node {
  constructor(key,level,value=key) {
    this.key = key;
    this.value = value;
    this.parent = null;
    this.children = [];
    this.level = level;
    this.opened = false;

    makeObservable(this,{
      children: observable,
      value: observable,
      opened: observable,
      changeOpened: action,
      clearChildren: action,
    });
  }

  addChild(child){
    this.children.push(child);
  }

  get hasChildren(){
    return this.children.length>0
  };

  changeOpened = () => {
    this.opened = !this.opened;
  }

  clearChildren(){
    this.children = [];
  }
}

class Tree {
  constructor(key,value=key) {
    let node = new Node(key,0,value);
    this._root = node;

    makeObservable(this,{
      _root: observable,
      insert: action,
      remove: action,
    });
  }
  
  find(key, node = this._root) {
    if (node.key == key)
        return node;
    for (let child of node.children) {
        let res = this.find(key, child)
        if (res)
          return res;
    }   
    return null;
  }


  insert(parentKey,key,value) {
    let parent = this.find(parentKey);
    let node = new Node(key,parent.level+1,value);
    if (parent) {
        parent.children.push(node);
        node.parent = parent;
        return node;
    }
    else {
        throw new Error(`Cannot add node: parent with value ${parent} not found.`);
    }
  }

  remove(key) {
    let node = this.find(key)
    if (node) {
        let parent = node.parent;
        let indexOfNode = parent.children.indexOf(node);
        parent.children.splice(indexOfNode, 1);
    }
    else {
        throw new Error(`Cannot remove node: node with value ${key} not found.`);
    }
  }

    *preOrderTraversal(node = this._root) {
      yield node;
      if (node.children.length) {
        for (let child of node.children) {
          yield* this.preOrderTraversal(child);
        }
      }
    }


}




  export default Tree;