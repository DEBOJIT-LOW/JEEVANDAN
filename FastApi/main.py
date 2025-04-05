import uvicorn
import json
import pickle
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy
import pandas

class TidalValues(BaseModel):
    Age:int
    Weight:int
    BPM:int
    SPO2:int

app=FastAPI()
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/')
async def scoring_endpoint():
    return {"Hello":"World"}

script_dir=os.path.dirname(os.path.abspath(__file__))
model_path=os.path.join(script_dir,'TidalVol.pkl')

with open(model_path,'rb') as f:
    model=pickle.load(f)

@app.post('/predict')
async def predict_TidalVol(item:TidalValues):
    print(item)
    Age=item.Age
    Weight=item.Weight
    BPM=item.BPM
    SPO2=item.SPO2
    input_list=[Age,Weight,BPM,SPO2]
    yHat=model.predict([input_list])
    print(yHat)

    return{'Prediction':yHat[0]}

script_dir2=os.path.dirname(os.path.abspath(__file__))
model_path2=os.path.join(script_dir2,'RR.pkl')
with open(model_path2,'rb') as f:
    model2=pickle.load(f)

@app.post('/predictRR')
async def predict_RR(item:TidalValues):
    Age=item.Age
    Weight=item.Weight
    BPM=item.BPM
    SPO2=item.SPO2
    input_list=[Age,Weight,BPM,SPO2]
    yHat=model2.predict([input_list])

    return {'prediction':yHat[0]}
