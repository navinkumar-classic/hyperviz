<h1 style="display: inline;">HyperViz
<img src="https://github.com/user-attachments/assets/7b6699b6-97ef-4de4-8615-eeba14b174cb" alt="hypervizlogo" style="display: inline; vertical-align: text-bottom; height: 40px;"></h1>


## Overview
Machine learning; a subject considered extremely complex and difficult to understand have. Well, what if ML models and understanding the effects of hyperparameters don't have to be black box? **HyperViz** is a dynamic interactive web platform developed to allow visual learning for anyone interested in understanding the working of these models and how to tune hyperparameters efficiently. It turns the dry, theoretical concepts of machine learning into something intuitive and interactive. enabling users to understand how various algorithms work, visualize them via realtime simulations and experience the effects of hyperparameter tuning.

The project leverages NextJS in combination with TypeScript to create our scalable front-end application while we run models in the back using Flask, either with the help of ML libraries or direct implementation.

## Models Available
- KNN
- K Means
- Linear and Polynomial Regression
- DBSCAN
- Naive Bayes
- Neural Network: MLP
- Reinforcement Learning
- PCA
- SOM
- Decision Tree

## Features


## Technology Stack
- **Frontend:** React / NextJS + Canvas API
- **Backend:** Flask + ML Library
- **Styling:** TailwindCSS
- **Visualization:** Custom logic using React hooks and canvas rendering

## Installation
### Prerequisites
1. Install Material UI (Core + Icons)
```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

2. Install Three.js
```
npm install three
```

3. Install Tailwind CSS
```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

### Running Locally
```
git clone https://github.com/navinkumar-classic/hyperviz.git
cd hyperviz
npm install
npm run dev
```

## Usage
We have made sure that our website is easily navigable and intuitive in its usage.
### Homepage
![image](https://github.com/user-attachments/assets/ae3a12b3-9716-4520-84fe-4ec44d7c31bf)

### Samples
This dynamic Q-learning visualizaer helps to understand reinforcement learning and the effects of hyperparameters. The user can set the obstacles and tune the hyperparameters and manually run episode simulations and watch the reward progress in real time.

![image](https://github.com/user-attachments/assets/ba3a90c9-7afe-4583-8310-f789948c05e7)

This visualizer helps the user to clearly understand how SOMs (Self Organizing Maps) classifier works, allowing the user to click anywhere to add their own points and tune the parameters.

![image](https://github.com/user-attachments/assets/3f260dd3-1c57-456e-b4ba-f919bca4f4f9)

The user can choose what type of regression they want to play with, set the hyperparameters and then place points to see the regression curve dynamically forming to fit their points.

![image](https://github.com/user-attachments/assets/01f386f3-f288-4d23-96b9-4b9ec77f132a)

### Step By Step

To obtain further clarity into how to use the visualizer and some technical details to help gain better insights, the user can click on the "STEP BY STEP" button at the bottom left of the screen.

![image](https://github.com/user-attachments/assets/02f7fe23-9fc0-4867-839f-6b45a27cea0d)


## License
This project is licensed under the [MIT License](LICENSE).

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive messages.
4. Submit a pull request for review.

## Contributors
- **Sriram B. Swami**  
- **A.O. Navin Kumar**  
- **Meghna Varma**

---
Thank you for exploring HyperViz. Let's learn ML smarter, stronger and better!
