import React, { useState, useEffect } from 'react'
import { PlusCircle, Moon, Sun, Trash2 } from 'lucide-react'
import QuestionForm from './components/QuestionForm'
import FormPreview from './components/FormPreview'
import Modal from './components/Modal'
import { Question } from './types'

function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [darkMode, setDarkMode] = useState(false)

   const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)

  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null)
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addQuestion = (question: Question) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? question : q))
    } else {
      setQuestions([...questions, question])
    }
    closeModal()
  }

  const startEditing = (question: Question) => {
    setEditingQuestion(question)
    setIsModalOpen(true)
  }

  const openModal = () => {
    setEditingQuestion(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingQuestion(null)
    setIsModalOpen(false)
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < questions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]]
      setQuestions(newQuestions)
    }
  }

    const confirmDeleteQuestion = (questionId: number) => {

    setQuestionToDelete(questionId)

    setIsDeleteConfirmationOpen(true)

  }



  const deleteQuestion = () => {
    if (questionToDelete !== null) {
      setQuestions(questions.filter(q => q.id !== questionToDelete))
      setIsDeleteConfirmationOpen(false)
      setQuestionToDelete(null)
    }
  }
  
  const handleValidateForm = (formResponses: Record<string, string>) => {
    setResponses(formResponses)
    setIsResponseModalOpen(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} p-8 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Generador de Formularios Dinámicos</h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} transition-colors duration-300`}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
        <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-b ${darkMode ? 'border-gray-600' : 'border-blue-100'}`}>
          <button
            className="flex items-center justify-center w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 font-medium text-lg"
            onClick={openModal}
          >
            <PlusCircle className="mr-2" size={24} />
            Agregar pregunta
          </button>
        </div>
        {questions.length > 0 && (
          <div className="p-6">
            <h2 className={`text-2xl font-semibold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vista Previa del Formulario</h2>
            <FormPreview 
              questions={questions} 
              onEditQuestion={startEditing}
              onMoveQuestion={moveQuestion} 
              onDeleteQuestion={confirmDeleteQuestion}
              onValidateForm={handleValidateForm}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingQuestion ? 'Editar Pregunta' : 'Agregar Pregunta'}
        darkMode={darkMode}
      >
        <QuestionForm 
          onAddQuestion={addQuestion} 
          editingQuestion={editingQuestion}
          onCancelEdit={closeModal}
          darkMode={darkMode}
        />
      </Modal>
      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        title="Respuestas del Formulario"
        darkMode={darkMode}
      >
        <div className="space-y-4">
          {questions.sort((a, b) => a.id - b.id).map(question => {
            const response = responses[question.id.toString()]
            return (
              <div key={question.id} className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} pb-3`}>
                <p className="font-semibold">{question.text}</p>
                <p>{response || 'Sin respuesta'}</p>
              </div>
            )
          })}
        </div>
      </Modal>

            <Modal

        isOpen={isDeleteConfirmationOpen}

        onClose={() => setIsDeleteConfirmationOpen(false)}

        title="Confirmar eliminación"

      >

        <div className="space-y-4">

          <p>¿Estás seguro de que deseas eliminar esta pregunta?</p>

          <div className="flex justify-end space-x-2">

            <button

              onClick={() => setIsDeleteConfirmationOpen(false)}

              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"

            >

              Cancelar

            </button>

            <button

              onClick={deleteQuestion}

              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"

            >

              Eliminar

            </button>

          </div>

        </div>

      </Modal>
    </div>
  )
}

export default App