export const dbscan_json={
    "expl":`# **DBSCAN**  is a powerful clustering algorithm that groups data points based on **density** rather than distance to centroids. 

            It relies on two key parameters:
            
            - **\`epsilon (ε)\`** – the maximum distance between two points to be considered neighbors 
             
            - **\`minPts\`** – the minimum number of neighbors a point must have to be considered a **core point**
            
            A **core point** is one that has at least \`minPts\` neighbors within its \`ε\`-radius. Clusters are formed by chaining together core points and including their reachable neighbors. Points that don’t meet these density criteria and aren’t reachable from any core point are classified as **noise** or **outliers**.
            
            It’s particularly useful in datasets with **uneven densities or noise** — though selecting appropriate values for \`ε\` and \`minPts\` is crucial for good performance.  
            `
}

export const dt_json={
    "expl":`At each internal node, the algorithm chooses the feature and threshold that best split the data 
        according to a **purity metric**, such as:
        
        - **\`Gini Impurity\`** – measures the likelihood of incorrect classification
         
        - **\`Entropy\`** – captures the amount of disorder or uncertainty in the data
        
        Splits continue recursively until nodes are pure or meet stopping criteria. 
        Each **leaf node** represents a predicted class or value.

        Decision trees are **easy to interpret** and require minimal data preprocessing,but they can **overfit** without pruning or regularization.
`
}
export const som_json={
    "expl":`Self-Organizing Maps (SOM) are unsupervised neural networks used to project high-dimensional data onto a lower-dimensional (typically 2D) grid while preserving topological structure.        Each node in the grid is associated with a weight vector of the same dimension as the input data.
        
        During training:
        
        - **\`Best Matching Unit (BMU)\`** – the node whose weight is closest to the input vector
        
        - **\`Neighborhood Update\`** – the BMU and its nearby nodes are updated to become more similar to the input
        
        Over time, the map organizes itself so that **similar inputs activate nearby nodes**, forming spatial patterns.

        SOMs are especially useful for **visualizing clusters** and **dimensionality reduction**, though they require careful tuning of learning rate and neighborhood radius.

`
}

export const pca_json={
    "expl":`Principal Component Analysis (PCA) is a powerful technique for dimensionality reduction that transforms data into a new coordinate system to capture the most variance.        
    
    It works by identifying **principal components**, which are orthogonal directions of maximum variance in the data, computed through **eigen decomposition** or **singular value decomposition (SVD)**.
        
        Key concepts:   
        - **\`Principal Components\`** – new axes that capture decreasing amounts of variance in the data
        
        - **\`Explained Variance\`** – indicates how much information each principal component retains

        By projecting data onto the top components, PCA reduces dimensionality while preserving structure.

`
}

export const rl_json={
    "expl":`Q-Learning is a model-free reinforcement learning algorithm that learns the optimal action-value 
    function for an agent interacting with an environment.
            It estimates the expected future rewards for each action in a given state using the **Q-table**.
        
        Key update rule:
        
        - **\`Q(s, a) ← Q(s, a) + α [r + γ * max Q(s', a') – Q(s, a)]\`**
         
            - **\`α\`** – learning rate  
            - **\`γ\`** – discount factor  
            - **\`r\`** – reward received  
            - **\`s'\`** – next state after taking action \`a\` in state \`s\`
        
        The agent uses **exploration (e.g., ε-greedy)** to try new actions and **exploitation** to use learned knowledge.

        Over time, Q-Learning converges to the **optimal policy**, even without knowing the environment's dynamics.

`
}
export const nn_json={
    "expl":`Multilayer Perceptrons (MLPs) are a class of feedforward neural networks composed of layers of 
    interconnected neurons with learnable weights.
            They consist of:
        
        - **\`Input layer\`** – receives raw features  
        - **\`Hidden layers\`** – apply weighted sums and **non-linear activation functions** (e.g., ReLU, tanh)  
        - **\`Output layer\`** – produces predictions (e.g., probabilities for classification)
        
        Training is done via **backpropagation** and **gradient descent**, minimizing a loss function.

        MLPs can model **complex, non-linear relationships**, making them powerful for a wide range of supervised learning tasks — but they require careful tuning and sufficient data to avoid overfitting.

`
}
export const nb_json={
    "expl":`Naive Bayes is a simple yet effective probabilistic classifier based on Bayes’ Theorem with the naïve
     assumption of feature independence.
             It calculates the probability of each class given the input features using:
        
        - **\`P(class | features) ∝ P(class) * Π P(feature | class)\`**
        
        - Assumes each feature contributes **independently** to the probability of the class
         
        Common variants:
        
        - **Gaussian** (for continuous data)  
        - **Multinomial** (for counts, e.g., text)  
        - **Bernoulli** (for binary features)
        
        Naive Bayes is fast, scalable, and works surprisingly well for **text classification** and other high-dimensional tasks,despite its strong independence assumption.

`
}
export const lr_json={
    "expl":`Linear Regression is a fundamental supervised learning algorithm that models the relationship between input features and a continuous target using a straight line.It fits a line of the form:
        
        - **\`y = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ\`**
        
        It assumes a **linear relationship** between inputs and the output. Simple, interpretable, and efficient — but limited when the true relationship is non-linear.  
        Polynomial Regression extends linear regression by modeling non-linear relationships using polynomial terms of the input features.
        It transforms inputs into higher-degree features:
        
        - **\`y = w₀ + w₁x + w₂x² + ... + w_d x^d\`**
        
        While it captures non-linear patterns, polynomial regression can **overfit** if the degree is too high, so regularization or cross-validation is often needed for stability.


`
}
export const kmeans_json={
    "expl":`K-Means is a popular unsupervised clustering algorithm that partitions data into K distinct groups
     based on feature similarity.
             It works iteratively through two main steps:
        
        - **\`Assignment Step\`** – assign each point to the nearest cluster centroid  
        - **\`Update Step\`** – recalculate centroids as the mean of all assigned points
        
        The algorithm repeats these steps until **convergence** (centroids stop changing or assignments stabilize).

        K-Means is efficient and easy to implement, but it assumes **spherical clusters of similar size** 
        and is sensitive to the choice of **K** and **initial centroids**.



`
}
export const knn_json={
    "expl":`K-Nearest Neighbors (KNN) is a simple, instance-based supervised learning algorithm used for 
    classification and regression.
            It makes predictions based on the **K closest data points** (neighbors) in the feature space.
        
        Key components:
        
        - **\`Distance Metric\`** – typically Euclidean distance is used to find nearest neighbors  
        - **\`Majority Vote\`** (classification) or **\`Average\`** (regression) among neighbors determines the output
        
        KNN is **non-parametric** and requires no training phase, but it can be **computationally expensive** at prediction time.

        It performs well with **well-separated classes** but is sensitive to **feature scaling** and the choice of **K**.

`
}