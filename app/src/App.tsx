import axios from "axios"
import { useState } from "react"

function App() {
  const [passager, setPassager] = useState({})
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const URL = "https://titanic-predict-proyect.onrender.com/predict"

  const handleChange = (e: any) => {
    setPassager({
      ...passager,
      [e.target.id]: e.target.value
    })
    setError(null)
  }

  const handleReset = () => {
    setPassager({})
    setResult(null)
    setError(null)
    // Reset all form inputs
    const form = document.querySelector('form')
    if (form) {
      form.reset()
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      const resp = await axios.post(URL, passager)
      setResult(resp.data.percentage_survival)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Predicción de Supervivencia - Titanic 🚢
          </h1>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Clase del pasajero (Pclass)
              </label>
              <select
                id="Pclass"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
                <option value="">Seleccionar...</option>
                <option value="1">Primera</option>
                <option value="2">Segunda</option>
                <option value="3">Tercera</option>
              </select>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Sexo
              </label>
              <select
                id="Sex"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
                <option value="">Seleccionar...</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Edad
              </label>
              <input
                id="Age"
                onChange={handleChange}
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej. 28"
              />
            </div>

            {/* SibSp */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Hermanos / Cónyuges a bordo (SibSp)
              </label>
              <input
                id="SibSp"
                onChange={handleChange}
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej. 1"
              />
            </div>

            {/* Parch */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Padres / Hijos a bordo (Parch)
              </label>
              <input
                id="Parch"
                onChange={handleChange}
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej. 0"
              />
            </div>

            {/* Fare */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Tarifa (Fare)
              </label>
              <input
                id="Fare"
                onChange={handleChange}
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej. 32.5"
              />
            </div>

            {/* Embarked */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Puerto de embarque (Embarked)
              </label>
              <select
                id="Embarked"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400">
                <option value="">Seleccionar...</option>
                <option value="C">Cherbourg</option>
                <option value="Q">Queenstown</option>
                <option value="S">Southampton</option>
              </select>
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex justify-center gap-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                type="button"
                className={`${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white px-6 py-2 rounded-xl font-semibold transition duration-200`}
              >
                {loading ? 'Calculando...' : 'Calcular Probabilidad'}
              </button>
              <button
                onClick={handleReset}
                type="button"
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold hover:bg-gray-400 transition duration-200"
              >
                Limpiar
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 text-center">
              <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {/* Resultado */}

            <div className="mt-8 text-center h-20">
              <p className="text-lg text-gray-700 mb-2">Probabilidad de sobrevivir:</p>
              <div className={`text-3xl font-bold ${parseFloat(result!) >= 50?"text-green-600 bg-green-100":"text-red-600 bg-red-100"} inline-block px-6 py-2 rounded-xl shadow-inner`}>
                {result?result:"0.0%"}
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App
