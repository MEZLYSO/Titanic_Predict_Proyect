from pathlib import Path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

FEATURES = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']

def _load_and_train():

    df = pd.read_csv(Path(__file__).resolve().parents[2] / 'train.csv')
    df['Age'] = df['Age'].fillna(df['Age'].median())
    df['Embarked'] = df['Embarked'].fillna(df['Embarked'].mode()[0])

    encoders = {}
    for col in ['Sex', 'Embarked']:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    X = df[FEATURES]
    y = df['Survived']
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression(max_iter=250)
    model.fit(X_train, y_train)
    return model, encoders

MODEL,ENCODERS = _load_and_train()

@api_view(['POST'])
def main(request):

    data = request.data
    if not isinstance(data, dict):
        return Response({'error': 'El body debe ser un objeto JSON'}, status=status.HTTP_400_BAD_REQUEST)

    missing = [f for f in FEATURES if f not in data]
    if missing:
        return Response({'error': f'Faltan campos: {missing}', 'required_features': FEATURES}, status=status.HTTP_400_BAD_REQUEST)

    try:
        input_df = pd.DataFrame([data])

        if 'Sex' in input_df.columns:
            input_df['Sex'] = ENCODERS['Sex'].transform(input_df['Sex'].astype(str))
        if 'Embarked' in input_df.columns:
            input_df['Embarked'] = ENCODERS['Embarked'].transform(input_df['Embarked'].astype(str))

        input_df = input_df[FEATURES]

        proba = float(MODEL.predict_proba(input_df)[0][1])*100

        return Response({'survival_probability': "{:.3f}%".format(proba)}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': 'Error procesando los datos', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
