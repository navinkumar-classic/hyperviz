"use client";
import Tiles from '../components/hometiles'


export default function Home() {
  

  return (
    <div className="w-full h-screen">
  <div className="w-full h-1/3  flex justify-evenly">
    <Tiles modelName={"kmeans"} name={"KMeans"} picture={"/Screenshot 2025-06-23 122149.png"}/>
    <Tiles modelName={"linear"} name={"Linear Regression"} picture={"lr_thumbnail.png"}/>
    <Tiles modelName={"DBSCAN"} name={"DBSCAN"} picture={"dbscan_thumbnail.png"}/>
  </div>
  <div className="w-full h-1/3  flex justify-evenly">
    <Tiles modelName={"NaiveBayes"} name={"Naive Bayes"} picture={"nb_thumbnail.jpg"}/>
    <Tiles modelName={"neural"} name={"Neural networks"} picture={"nn_thumbnail.png"} />
    <Tiles modelName={"Qlearning"} name={"Reinforcement Learning"} picture={"rl_thumbnail.png"} />
  </div>
  <div className="w-full h-1/3  flex justify-evenly">
    <Tiles modelName={"PCA"} name={"PCA"} picture={"pca_thumbnail.png"}/>
    <Tiles modelName={"SOM"} name={"SOM"} picture={"som_thumbnail.png"}/>
    <Tiles modelName={"DecisionTree"} name={"Decision Tree"} picture={"dt_thumbnail.png"} />
  </div>
  
</div>
  );
}
