export const dbscan_json = {
    "expl": `DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points based on density rather than predefined cluster count.

1. **Add Points**  
   - Click on the graph to create data points.

2. **Set Parameters**  
   - **\`ε (Epsilon)\`**: The maximum distance between two points to be considered neighbors  
   - **\`minPts\`**: Minimum number of neighboring points required to form a dense region

3. **View Clustering Results**  
   • The algorithm automatically identifies:  
     • **Core points**: Points with at least \`minPts\` neighbors within ε  
     • **Border points**: Near a core point but not dense enough themselves  
     • **Noise points**: Not reachable from any core points  
   • Change ε and minPts to instantly see how clusters and noise regions update in real time

DBSCAN is useful for finding clusters of arbitrary shape and handling noise effectively without specifying the number of clusters.
`
};

export const kmeans_json = {
    "expl": `K-Means groups data into **K clusters** by minimizing the **Within-Cluster Sum of Squares (WCSS)**.

1. **Add Points**  
   - Click on the graph to create data points.

2. **Set Parameters**  
   - **\`K\`**: Number of clusters  
   - **\`Init\`**: Random or K-Means++  
   - **\`Max Iterations\`**: Cap on centroid updates

3. **Click "Classify" Button**  
   - The algorithm assigns points to the nearest centroid and updates centroids until convergence.

4. **Generate Elbow Graph**  
   • Vary the K value and click "Classify" Button to register the value in the graph.
   • if the result seems abnormal run it again with the same parameter to make sure an ideal convergence is reached. 
   • This plots WCSS vs. K  
   • The **elbow point** (where the curve bends) suggests the ideal number of clusters
`
};

export const linear_json={
    "expl": `This tool fits a line or curve to your data using different types of regression algorithms.

1. **Add Points**  
   - Click on the graph to create data points.

2. **Select Regression Type**  
   - **Linear Regression**: Fits a straight line to minimize squared error  
   - **Ridge Regression**: Linear regression with **regularization** to reduce overfitting  
   - **Polynomial Regression**: Fits a curve of chosen degree to the data

3. **Adjust Parameters**  
   • For **Ridge Regression**:  
     • Set **\`λ (lambda)\`** — higher values increase regularization and shrink coefficients  
   • For **Polynomial Regression**:  
     • Choose the **degree** of the polynomial curve

4. **View Results**  
   • The regression curve updates in real time  
   • Different methods show how the model fits or overfits depending on the parameters and data shape

Use this to explore how model complexity and regularization affect curve fitting and generalization.
`
};
export const naive_json={
    "expl":`# **DBSCAN**  is a powerful clustering algorithm that groups data points based on **density** rather than distance to centroids. 

            It relies on two key parameters:
            
            - **\`epsilon (ε)\`** – the maximum distance between two points to be considered neighbors 
             
            - **\`minPts\`** – the minimum number of neighbors a point must have to be considered a **core point**
            
            A **core point** is one that has at least \`minPts\` neighbors within its \`ε\`-radius. Clusters are formed by chaining together core points and including their reachable neighbors. Points that don’t meet these density criteria and aren’t reachable from any core point are classified as **noise** or **outliers**.
            
            It’s particularly useful in datasets with **uneven densities or noise** — though selecting appropriate values for \`ε\` and \`minPts\` is crucial for good performance.  
            `
}
export const pca_json={
    "expl":`# **DBSCAN**  is a powerful clustering algorithm that groups data points based on **density** rather than distance to centroids. 

            It relies on two key parameters:
            
            - **\`epsilon (ε)\`** – the maximum distance between two points to be considered neighbors 
             
            - **\`minPts\`** – the minimum number of neighbors a point must have to be considered a **core point**
            
            A **core point** is one that has at least \`minPts\` neighbors within its \`ε\`-radius. Clusters are formed by chaining together core points and including their reachable neighbors. Points that don’t meet these density criteria and aren’t reachable from any core point are classified as **noise** or **outliers**.
            
            It’s particularly useful in datasets with **uneven densities or noise** — though selecting appropriate values for \`ε\` and \`minPts\` is crucial for good performance.  
            `
}
export const qlearning_json={
    "expl": `Q-Learning is a model-free reinforcement learning algorithm used to learn the best action to take in each state to maximize long-term rewards.

1. **Define Environment**  
   - A grid or state-space where an agent can move and receive rewards.

2. **Set Parameters**  
   - **\`Learning Rate (α)\`**: Controls how much newly acquired information overrides old estimates  
   - **\`Discount Factor (γ)\`**: Determines how much future rewards are valued over immediate rewards

3. **Train Agent**  
   • The agent explores the environment  
   • Updates its Q-values using the Bellman equation  
   • Over time, it learns an optimal policy that maximizes total reward

Q-Learning is foundational in reinforcement learning and is effective for solving problems where the model of the environment is unknown.
`
};
export const som_json={
    "expl": `SOM is an unsupervised learning algorithm that projects high-dimensional data onto a 2D grid while preserving topological structure.

1. **Add Points**  
   - Click on the graph to create input data points.

2. **Set Parameters**  
   - **\`SOM Width\`**: Number of columns in the SOM grid  
   - **\`SOM Height\`**: Number of rows in the SOM grid  
   - **\`Iterations\`**: Number of training steps to run  
   - **\`Learning Rate\`**: Controls how much the SOM weights update during training

3. **View Results**  
   • The SOM grid updates as training progresses  
   • Each input point is mapped to a grid cell (neuron)  
   • Similar inputs get mapped to nearby cells, forming clusters naturally

SOMs are especially useful for visualizing and clustering high-dimensional data in a low-dimensional space.
`
};