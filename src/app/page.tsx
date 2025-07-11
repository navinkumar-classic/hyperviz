"use client";
import Tiles from '../components/hometiles'
export default function Home() {
  

  return (
    <div className="w-full h-screen">
    <div className="w-full max-w-screen-xl mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex justify-evenly">
    <Tiles modelName={"kmeans"} name={"KMeans"} picture={"/kmeans_thumbnail.png"}/>
    <Tiles modelName={"linear"} name={"Linear Regression"} picture={"lr_thumbnail.png"}/>
    <Tiles modelName={"DBSCAN"} name={"DBSCAN"} picture={"dbscan_thumbnail.png"}/>
    <Tiles modelName={"NaiveBayes"} name={"Naive Bayes"} picture={"nb_thumbnail.jpg"}/>
    <Tiles modelName={"neural"} name={"Neural networks"} picture={"nn_thumbnail.png"} />
    <Tiles modelName={"Qlearning"} name={"Reinforcement Learning"} picture={"rl_thumbnail.png"} />
    <Tiles modelName={"PCA"} name={"PCA"} picture={"pca_thumbnail.png"}/>
    <Tiles modelName={"SOM"} name={"SOM"} picture={"som_thumbnail.png"}/>
    <Tiles modelName={"DecisionTree"} name={"Decision Tree"} picture={"dt_thumbnail.png"} />
  </div>
  </div>
</div>
  );
}