import React, { useState, useEffect } from 'react'
import { Question } from '../types'
import { PlusCircle, X, ArrowUp, ArrowDown } from 'lucide-react'

interface QuestionFormProps {
  onAddQuestion: (question: Question) => void
  editingQuestion: Question | null
  onCancelEdit: () => void
  darkMode: boolean
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onAddQuestion, editingQuestion, onCancelEdit, darkMode }) => {
  const [question, setQuestion] = useState<Question>({
    id: Date.now(),
    text: '',
    type: 'text',
    options: [],
    required: false,
  })
  const [newOption, setNewOption] = useState('')

  useEffect(() => {
    if (editingQuestion) {
      setQuestion(editingQuestion)
    } else {
      setQuestion({
        id: Date.now(),
        text: '',
        type: 'text',
        options: [],
        required: false,
      })
    }
  }, [editingQuestion])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.text.trim()) {
      onAddQuestion(question)
    }
  }

  const addOption = () => {
    if (newOption.trim()) {
      setQuestion({
        ...question,
        options: [...(question.options || []), newOption.trim()],
      })
      setNewOption('')
    }
  }

  const removeOption = (index: number) => {
    const newOptions = [...(question.options || [])]
    newOptions.splice(index, 1)
    setQuestion({ ...question, options: newOptions })
  }

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...(question.options || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newOptions.length) {
      [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]]
      setQuestion({ ...question, options: newOptions })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="transition-all duration-300 ease-in-out">
        <label htmlFor="questionText" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
          Texto de la Pregunta
        </label>
        <input
          type="text"
          id="questionText"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
          className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
          required
        />
      </div>
      <div className="transition-all duration-300 ease-in-out">
        <label htmlFor="questionType" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
          Tipo de Respuesta
        </label>
        <select
          id="questionType"
          value={question.type}
          onChange={(e) => setQuestion({ ...question, type: e.target.value as Question['type'] })}
          className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
        >
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="date">Fecha</option>
          <option value="select">Selección</option>
          <option value="switch">Switch</option>
          <option value="radio">Radio Button</option>
          <option value="paragraph">Párrafo</option>
        </select>
      </div>
      <div className="flex items-center transition-all duration-300 ease-in-out">
        <input
          type="checkbox"
          id="requiredField"
          checked={question.required}
          onChange={(e) => setQuestion({ ...question, required: e.target.checked })}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} rounded transition-all duration-200`}
        />
        <label htmlFor="requiredField" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Campo Obligatorio
        </label>
      </div>
      {(question.type === 'select' || question.type === 'radio') && (
        <div className="space-y-2 transition-all duration-300 ease-in-out">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Opciones</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className={`flex-grow px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
              placeholder="Nueva opción"
            />
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Agregar
            </button>
          </div>
          <ul className={`space-y-2 max-h-40 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-md p-2`}>
            {question.options?.map((option, index) => (
              <li key={index} className={`flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-white'} px-3 py-2 rounded-md transition-all duration-200 hover:bg-opacity-80`}>
                <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{option}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveOption(index, 'up')}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOption(index, 'down')}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                    disabled={index === question.options!.length - 1}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          className="flex-grow bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          {editingQuestion ? 'Guardar Cambios' : 'Agregar Pregunta'}
        </button>
        <button
          type="button"
          onClick={onCancelEdit}
          className={`${darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200`}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default QuestionForm