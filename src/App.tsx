import {useState,useEffect,ChangeEvent,KeyboardEvent} from 'react'

interface FormList {
    text : string,
    id : number,
    completed : boolean
}

interface ChildProps {
    item : FormList,
    onToggle : (id:number) => void,
    onEdit : (id:number,text:string) => void,
    onSave : () => void,
    onDelete : (id:number) => void,
    editId : number | null,
    editText : string,
    setEditText : React.Dispatch<React.SetStateAction<string>>
}

const App = () => {

const [input,setInput] = useState<string>("")

const [array,setArray] = useState<FormList[]>(()=>{
    const saved  = localStorage.getItem("todos");
    
    return saved? JSON.parse(saved) as FormList[] : []
});

useEffect(()=>{
    localStorage.setItem("todos",JSON.stringify(array))
},[array])

const [editId,setEditId] = useState< number | null >(null)

const [editText,setEditText] = useState<string>("")

const Change = (e:ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
}

const KeyDown = (e:KeyboardEvent<HTMLInputElement>): void => {
    if(e.key === "Enter" && input.trim() !== ""){
        const newList = {
            text : input,
            id : Date.now(),
            completed : false
        }
        setArray(prev => [...prev,newList]);
        setInput("")
    } 
}

const Toggle = (id:number) => {
    setArray(prev => prev.map(item => item.id === id? {...item, completed : !item.completed} : item))
} 

const Edit = (id:number,text:string) => {
    setEditId(id);
    setEditText(text)
}

const Save = () => {
if(editId === null) return;
    setArray(prev => prev.map(item => item.id === editId? {...item, text : editText} : item));
    setEditId(null);
    setEditText("");
}

const Delete = (id:number) => {
    setArray(prev => prev.filter(item => item.id !== id))
}

    return(
        <>
        <h1>To Do List</h1>
        <input type="text" placeholder="To do List" value={input} onChange={Change} onKeyDown={KeyDown} />
        
        <ul style={{
            listStyle : "none"
        }}>
            {array.map(item => (
                <Child key={item.id} 
item={item}
onToggle={Toggle}
onEdit={Edit}
onSave={Save}
onDelete={Delete}
editId={editId}
editText={editText}
setEditText={setEditText} />
            ))}
        </ul>
        </>
    )
}

const Child = ({item,onToggle,onEdit,onSave,onDelete,editId,editText,setEditText}: ChildProps) => {
    return(
        <>
        <div>
          {
         editId === item.id?
          <input value={editText} onChange = { (e:ChangeEvent<HTMLInputElement>) => {
      setEditText(e.target.value)        
          }}/> :
          <span onClick={()=>onToggle(item.id)} style = {{
              textDecoration : 
              item.completed? "line-through" : "none",
              cursor : "pointer"
          }}>
              {item.text}
          </span>
         }
         
         {
         editId === item.id?
          <button onClick={()=>onSave()}>
              Save
          </button> :
          <button onClick={()=>onEdit(item.id,item.text)}>
              Edit
          </button>
         }
         
         <button onClick={()=>onDelete(item.id)}>
             Del
         </button>
        </div>
        </>
    )
}

export default App
