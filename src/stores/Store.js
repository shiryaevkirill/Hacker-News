import { observable,makeObservable,action, runInAction} from "mobx"
import Tree from '../utils/TreeNode'; 

const PATH = "https://hacker-news.firebaseio.com/v0/"

class Store{
    searchData = {
      maxId: -1,
    };
    newsData = [];
    current_page_id = -1;
    comments_tree = new Tree(-1);
    autoUpdate = 60;
  
    constructor(){
      makeObservable(this,{
        newsData: observable,
        setNewsId: action,
        getNewsData: action,
        setNewsData: action,
        current_page_id: observable,
        comments_tree: observable,
        setCurrentId: action,
        setComments: action,
        refreshComments: action,
      });
      setInterval(this.refresh,1000*this.autoUpdate);
      this.refresh();
    }
  
    setCurrentId(id){
      if(this.current_page_id!=id){
        this.current_page_id = id;
        const data = this.newsData.find(x => x.id == id);
        this.comments_tree = new Tree(id,data);
        this.setComments(id);
      }
    }
  
    getNewsId(){
      const searchPath = "newstories.json";
      fetch(`${PATH}${searchPath}`)
        .then(res=>res.json())
        .then(result=>this.setNewsId(result));
    }
  
    setNewsId(ids){
      const newsId = ids.slice(0,100);
      this.getNewsData(newsId);
    }
  
    getData(searchQuery,type){
      const searchPath = "item/";
      fetch(`${PATH}${searchPath}${searchQuery}.json`)
        .then(res=> res.json())
        .then(result => type==='story'? this.setNewsData(result):this.setComments=result);
    }
  
    getNewsData(ids){
      const newIds = ids.slice(0,100);
      for(let i=0;i<100;i++){
        this.getData(newIds[i],'story');
      }
    }
  
    findIndex(time){
      const maxTime = Math.max(...(this.newsData.map(m => m?.time!=null ? m.time :-1)));
      return this.newsData.indexOf(ind => ind?.time == maxTime)
    }
  
    setNewsData(data){
      const ins = 
        {id: data.id, by: data.by, title: data.title,time:data.time,score:data.score,url:data.url,kids:data.kids,descendants:data.descendants};
      const curentPos = this.newsData.indexOf(this.newsData.find(x => x.id == data.id))
      if(curentPos>-1) this.newsData.splice(curentPos, 1);
      const indexIns = this.newsData.indexOf(this.newsData.find(x => x.time <= data.time));  
      this.newsData.splice(indexIns>-1?indexIns:this.newsData.length, 0, ins);
      if(this.newsData.length > 100) this.newsData = this.newsData.slice(0,100);   
    }
  
    getPageData(id){
      return this.newsData.find(x=>x.id==id);
    }
  
    setComments(id){
        let node = this.comments_tree.find(id);
        node.changeOpened();
        const searchPath = "item/";
        if(id!=this.current_page_id || node.value.descendants>0){
          node.value.kids.map((kid)=>{
            fetch(`${PATH}${searchPath}${kid}.json`)
            .then(res=> res.json())
            .then(data => {runInAction(()=>{this.comments_tree.insert(data?.parent,data.id,data);})});
          });
        }
    }
  
    removeComments(id){
      let node = this.comments_tree.find(id);
      node.changeOpened();
      node.clearChildren();
    }
  
    refreshComments(){
      const index = this.newsData.findIndex(x=>x.id == this.current_page_id);
      const searchPath = "item/";
      fetch(`${PATH}${searchPath}${this.current_page_id}.json`)
            .then(res=> res.json())
            .then(data => {runInAction(()=>{this.newsData[index].descendants=data.descendants})})
      this.comments_tree = new Tree(this.current_page_id,this.newsData[index]);
      this.setComments(this.current_page_id);
    }
  
    refresh = () => {this.current_page_id==-1&&this.getNewsId()};
  
  };

  export default Store