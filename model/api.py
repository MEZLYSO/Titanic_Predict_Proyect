import pandas as pd
from flask import Flask, jsonify, request
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from flask_cors import CORS

train_data= pd.read_csv("train.csv")
train_data['Age'].fillna(train_data['Age'].median(), inplace=True)
train_data['Embarked'].fillna(train_data['Embarked'].mode()[0], inplace=True)

encoders = {}
for col in ['Sex', 'Embarked']:
    encoders[col] = LabelEncoder()
    train_data[col] = encoders[col].fit_transform(train_data[col])

features = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']
target = 'Survived'
X = train_data[features]
Y = train_data[target]
X_train, X_val, y_train, y_val = train_test_split(X, Y, test_size=0.2, random_state=42)


model = LogisticRegression(max_iter=250)
model.fit(X_train, y_train)
app = Flask("__name__")

CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Obtener datos del request
        data = request.get_json()
        
        # Crear DataFrame con los datos recibidos
        input_data = pd.DataFrame([data])
        
        # Transformar variables categóricas
        if 'Sex' in input_data.columns:
            input_data['Sex'] = encoders['Sex'].transform([input_data['Sex'].iloc[0]])[0]
        if 'Embarked' in input_data.columns:
            input_data['Embarked'] = encoders['Embarked'].transform([input_data['Embarked'].iloc[0]])[0]
        
        # Asegurarse de que el DataFrame tiene todas las características necesarias
        for feature in features:
            if feature not in input_data.columns:
                return jsonify({
                    "error": f"Falta la característica: {feature}",
                    "required_features": features
                }), 400
        
        # Ordenar las columnas como el modelo espera
        input_data = input_data[features]
        
        # Obtener la probabilidad de supervivencia
        survival_prob = model.predict_proba(input_data)[0][1]
        
        # Devolver la predicción
        return jsonify({
            "percentage_survival": f"{float(survival_prob) * 100:.2f}%"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)