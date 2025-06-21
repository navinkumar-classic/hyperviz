export const dbscan_json={
    "expl":`# **DBSCAN**  is a powerful clustering algorithm that groups data points based on **density** rather than distance to centroids. 

            It relies on two key parameters:
            
            - **\`epsilon (ε)\`** – the maximum distance between two points to be considered neighbors 
             
            - **\`minPts\`** – the minimum number of neighbors a point must have to be considered a **core point**
            
            A **core point** is one that has at least \`minPts\` neighbors within its \`ε\`-radius. Clusters are formed by chaining together core points and including their reachable neighbors. Points that don’t meet these density criteria and aren’t reachable from any core point are classified as **noise** or **outliers**.
            
            It’s particularly useful in datasets with **uneven densities or noise** — though selecting appropriate values for \`ε\` and \`minPts\` is crucial for good performance.  
            `
}