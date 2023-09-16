import { useState, useEffect } from "react"

type ListDataType = {
  id: number
  content: string
}

const App = () => {

  const [listData, setListData] = useState<ListDataType[] | null>(null)

  const [newContent, setNewContent] = useState<string>("")

  // 取得list data
  const fetchListData = async () => {
    await fetch('http://127.0.0.1:5000')
      .then(response => response.json())
      .then(data => {

        // 接收到資料後
        // 製作id, content資料型態的陣列字典
        let keys = Object.keys(data)
        let dataArray: ListDataType[] = []
        for (let i = 0; i < keys.length; i++) {
          dataArray.push({
            id: i,
            content: data[keys[i]]
          })
        }

        // 存入Hook
        setListData(dataArray)
      })
      .catch(error => console.log(error))
  }

  // 新增表單資料變動handle
  const addContentValueChangeHandle = (e: any) => {
    setNewContent(e.target.value)
  }

  // 新增list data
  const addContentSubmitHandle = async () => {
    const response = await fetch('http://127.0.0.1:5000', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        a: newContent
      })
    })
    
    if (response.status === 201) {
      setNewContent("")
      await fetchListData()
      return
    }
  }

  // 編輯list data
  const editContentHandle = async (id: number, oldContent: string) => {
    let newContent = prompt("Change your content: ", oldContent)
    if (newContent == null || newContent == "") {
      alert('User cancelled the prompt.')
      return 
    } else {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aIndex: id,
          aNewValue: newContent
        })
      })

      if (response.status === 204) {
        await fetchListData()
        return 
      }
    }
  }

  // 移除list data
  const deleteContentHandle = async (id: number) => {
    const response = await fetch('http://127.0.0.1:5000', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aIndex: id
      })
    })

    if (response.status === 204) {
      await fetchListData()
      return 
    }
  }

  // 載入資料
  useEffect(() => {
    fetchListData()
  }, [])

  return (
    <div className="w-full p-3 min-h-screen bg-gray-900 text-white">

      {/* title */}
      <div className="w-full my-3">
        <h1 className="text-5xl font-black text-gray-300">To do list</h1>
      </div>

      <form className="w-full my-3">
        <label htmlFor="addListContent">Add content：</label>
        <input 
          type="text" 
          id="addListContent" 
          value={newContent}
          onChange={addContentValueChangeHandle}
          className="bg-gray-700 py-1 px-2 rounded-md" 
          placeholder="write your content" 
        />
        <button 
          type="button" 
          className="mx-3 p-2 bg-green-600 rounded-md"
          onClick={addContentSubmitHandle}
        >
          Submit
        </button>
      </form>

      {/* data table */}
      <table className="w-full text-xl">
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            listData === null ?
              // 無資料時顯示loading
              <tr>
                <td className="text-center">
                  Null
                </td>
                <td className="text-center">
                  Loading
                </td>
                <td className="text-center">
                  <button className="p-3 bg-blue-500 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                    </svg>
                  </button>
                </td>
                <td className="text-center">
                  <button className="p-3 bg-red-500 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
              :
              // 有資料時，使用map方法將資料列印出來
              listData.map(item => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="text-center">
                    {item.id}
                  </td>
                  <td className="text-center">
                    {item.content}
                  </td>
                  <td className="text-center">
                    <button 
                      className="p-3 bg-blue-500 rounded-md"
                      onClick={() => editContentHandle(item.id, item.content)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                      </svg>
                    </button>
                  </td>
                  <td className="text-center">
                    <button 
                      className="p-3 bg-red-500 rounded-md"
                      onClick={() => deleteContentHandle(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>

    </div>
  )
}

export default App