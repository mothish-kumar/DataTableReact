import React from 'react'
import {DataTable} from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useState,useEffect,useRef} from 'react'
import { Paginator } from 'primereact/paginator';
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

const App =  ()=>{
  const [data,setData] = useState([])
  const [currentPage,setCurrentPage]= useState(0)
  const [totalRecords,setTotalRecords] = useState(0)
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowClick,setRowClick] = useState(false)
  const [inputRow,setInputRow]= useState(0)
  const op = useRef(null);

  const row = 12

 
  const fetchData = (page)=>{
    fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}`)
    .then(((response)=>{
      if(!response.ok){
        throw new Error(`Http error! ${response.status} `)
      }
      return response.json()
    }))
    .then((result)=>{
      setData(result.data)
      setTotalRecords(result.pagination.total)
    })
    .catch((error)=>{
      console.log('Error Fetching Data',error)
    })
  }
  useEffect(()=>{
    fetchData(currentPage)
  },[currentPage])

  const handleSelection = async()=>{

    const selected = []
    let remaining = inputRow;
    let nextPage = currentPage

    while(remaining > 0 && nextPage * row < totalRecords){
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${nextPage}`)
      const result = await response.json()
      const allData = result.data

      for (let i = 0; i < allData.length && remaining > 0; i++) {
        if (!selectedRows.some((row) => row.id === allData[i].id)) {
          selected.push(allData[i]);
          remaining--;
        }
      }
      nextPage++
    }

    setSelectedRows((prevSelected) => [...prevSelected, ...selected]);  
  }
  const PageChangeFunc = (event)=>{
    setCurrentPage(event.page)
  }
  
  return (
    <>
    <h1>React Prime Table Assignment</h1>
    <InputSwitch 
      checked={rowClick} 
      onChange={(e) => setRowClick(e.value)}
      style={{marginLeft:'50%',marginBottom:'10px'}}
    />
    <DataTable 
      value={data}
      selectionMode={rowClick? null:"checkbox"}
      selection={selectedRows} 
      onSelectionChange={(e) => setSelectedRows(e.value)} 
      dataKey="id"
      tableStyle={{ border: "1px solid #ccc" }}
     >
      <Column 
        selectionMode="multiple" 
        header ={
          <span>
            <Button type="button" icon="pi pi-arrow-down" onClick={(e)=>op.current.toggle(e)} style={{backgroundColor:'white',color:'black',marginRight:'3px', width:'25px', height:'10px'}} />
            <OverlayPanel ref={op}>
              <InputNumber 
                value={inputRow} 
                onValueChange={(e) => setInputRow(e.value)} 
              /><br/> <br/>
              <Button label="Submit" style={{marginLeft:'180px'}} onClick={handleSelection} />
            </OverlayPanel>
          </span>
        }
        headerStyle={{ width: '3rem' }}
      ></Column>
      
      <Column 
        field='title' 
        header='Title' 
        style={{ border: "1px solid #ccc", textAlign: "left", padding:"10px" }}
      ></Column>

      <Column 
        field='place_of_origin' 
        header='Place of Orgin' 
        style={{ border: "1px solid #ccc", textAlign: "left" ,padding:"10px" }}
      ></Column>

      <Column 
        field='artist_display' 
        header='Artist' 
        style={{ border: "1px solid #ccc", textAlign: "left" ,padding:"10px" }}
      ></Column>

      <Column 
        field='inscriptions' 
        header='Inscriptions'
        body={(rowData) => rowData.inscriptions || "No Inscriptions"} 
        style={{ border: "1px solid #ccc", textAlign: "left",padding:"10px" }}
      ></Column>

      <Column 
        field='date_start' 
        header=' Start Date' 
        style={{ border: "1px solid #ccc", textAlign: "left",padding:"10px" }}
      ></Column>
      
      <Column 
        field='date_end' 
        header='End Date' 
        style={{ border: "1px solid #ccc", textAlign: "left",padding:"10px" }}
      ></Column>

    </DataTable>

    <Paginator
        first={currentPage * row}
        rows={row}
        totalRecords={totalRecords}
        onPageChange={PageChangeFunc}
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
      />
    </>
  )
}

export default App