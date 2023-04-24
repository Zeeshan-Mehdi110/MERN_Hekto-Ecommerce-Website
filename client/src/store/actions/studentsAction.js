import axios from "axios"

export const studentsActionTypes = {
    LOAING_STUDENTS : 'loading',
    LOADED_STUDENTS : 'loaded',
    DELETED_STUDENT : 'deleted student',
    UPDATED_STUDENT : "updated student",
    ERROR_OCCURE    : 'error',
}

export const loadStudents = () => {
    return (dispatch) => {
            dispatch({ type : studentsActionTypes.LOAING_STUDENTS })
            axios.get('http://localhost:5000/api/students').then(result => {
                dispatch({ type : studentsActionTypes.LOADED_STUDENTS , students : result.data.user })
            }).catch(err => {
                console.log(err)
                dispatch({ type : studentsActionTypes.ERROR_OCCURE , error : err.message })
            })
    }
}

export const deleteStudent = (id) => {
    return (dispatch) => {
        axios.post(`http://localhost:5000/api/students/delete/${id}`)
            .then(result => {
                dispatch({ type : studentsActionTypes.DELETED_STUDENT , id : id  })
            })
            .catch(err => {
                console.log(err)
                dispatch({ type : studentsActionTypes.ERROR_OCCURE , error : err.message })
            })
    }
}

export const editStudent = (id) => {
    return (dispatch) => {
        axios.get(`http://localhost:5000/api/students/edit/${id}`)
            .then(result => {
                console.log(result.data)
                dispatch({ type : studentsActionTypes.UPDATED_STUDENT , id : id  })
            })
            .catch(err => {
                console.log(err)
                dispatch({ type : studentsActionTypes.ERROR_OCCURE , error : err.message })
            })
    }
}
