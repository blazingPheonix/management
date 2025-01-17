"use client"

import React ,{useEffect, useMemo, useState} from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
import { format } from 'date-fns';

import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import { toast } from 'sonner';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Badge } from "@/components/ui/badge";


import { RecurringInterval } from '@prisma/client';
import { RECURRING_PERIOD } from '@/data/transaction';
import { categoryColors } from '@/data/categories';
import { useRouter } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu";
//   import { Checkbox } from "@/components/ui/checkbox";
  import { Button } from "@/components/ui/button";
  import { Trash } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { bulkDelete } from '@/actions/accounts';
import { BarLoader } from 'react-spinners';
  

function Transaction_table({item}) {

    const [selectedIds,setSelectedIds] = useState([]);
    const [sortConfig,setSortConfig] = useState({
      field:"date",
      direction:"desc",  
    });
    const [sortref,setSortRef] = useState();


    const [searchFilter,setSearchFilter] = useState('');
    const [typeFilter,setTypeFilter]     = useState('');
    const [recurringFilter,setRecurringFilter] = useState('');
    const [field1,setField] = useState('');

    const router = useRouter();
    console.log('this is transaction_table ',item)
    const [transaction_data,setTransactionData] = useState(item.transactions);
    const setData = item.transactions;
    




    //bulk delete 

      const {loading:deleteLoading,fn:deleteFn,data:deleted}=useFetch(bulkDelete);


      const handleBulkDelete = async () => {
        if(!window.confirm(`are you sure you want to delete ${selectedIds.length} transactions?`)){
            return ;
        }
        else {
          deleteFn(selectedIds);
        }
      };

      useEffect(()=>{
          if(deleted && !deleteLoading){
            toast.error("transactions deleted successfully");
            setSelectedIds('');
          }
          
      },[deleted,deleteLoading]);















    //apply sorting 
   
    const handleSelect = (id) => {
      // //alert('ok',id)
      setSelectedIds((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
    };
  
    const handleSelectAll = () => {
      //alert('clicked',selectedIds.length)
      setSelectedIds((current) =>
        (current && current.length === item.transactions.length)
          ? []
          : item.transactions.map((t) => t.id)
      );
    };


    const filterData = useMemo((field)=>{
       //alert('reveived ',field)

      let result =[...setData]; 
      if(searchFilter){
          // //alert('search filter')
          result = result.filter((transaction)=>transaction?.description?.includes(searchFilter.toLowerCase()));
      }

      if(typeFilter){
        // //alert('inside type filter',typeFilter)
        result = result.filter((transaction)=>transaction?.type===typeFilter);
    }



    
    if(recurringFilter){
      result = result.filter((transaction)=> recurringFilter==='recurring'?transaction.isRecurring===true:transaction.isRecurring===false);
  }




      console.log('this is ..............',field)
        if(field1){switch(field1){
           case 'date':
            //  setTransactionData((current)=>{
          //   current.sort((a,b)=>new Date(a.date)-new Date(b.date));
          //   // console.log('laaaaaaaaaaaaaaaa',current);
          // });
          // const op = sortConfig.direction==='desc'?'-':'+';
          //alert('inside date');
          if(sortConfig.direction==='desc')
           result = result.sort((a,b)=>new Date(a.date)- new Date(b.date));
          else{
            result = result.sort((a,b)=>new Date(b.date)- new Date(a.date));
          }
          console.log('check ckaffhdhdfs',result)
          // setTransactionData(result);
          console.log('check sorting ',result);
          break;
          case 'amount':
            console.log('$$$$$$$$$$$$$$$$$$')
            let acurrent='';
          if(sortConfig.direction==='desc')
            result =result.sort((a,b)=>(a.type==='EXPENSE'?-a.amount:a.amount)-(b.type==='EXPENSE'?-b.amount:b.amount));
          else{
            result =  result.sort((a,b)=>(b.type==='EXPENSE'?-b.amount:b.amount)-(a.type==='EXPENSE'?-a.amount:a.amount));
          }
          // setTransactionData(result);
          console.log('check sorting ',result);
          break;
          
        }
      }
        console.log('this is my result  ',result);
        if(result)
        setTransactionData(result);
    },[searchFilter,typeFilter,recurringFilter,sortConfig])

;
    const handleSort = (field)=>{
        //alert('clicked boy',field);
        console.log(field);
        setField(field);
        setSortConfig((current)=>({
          field,
          direction:
            current.field== field && current.direction === 'asc' ? 'desc':'asc',
        }));

    };


    
  return (
    <div className='w-full'>


        {deleteLoading && <BarLoader className='text-red'></BarLoader>}
      
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              // setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              // setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              // setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchFilter || typeFilter || recurringFilter || selectedIds || deleteLoading) && (
            <Button
              variant="outline"
              size="icon"
              onClick={()=>{
                setTypeFilter('');
                setRecurringFilter('');
                setSearchFilter('');
                setField('');
                setSelectedIds('');
              }}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )} 
        </div>
      {/* </div>


    {/* transactions table */}
        <div>
        <Table>
  <TableCaption className='mt-16'>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
    <TableHead className="w-[100px]"><Checkbox onCheckedChange={()=>handleSelectAll()}></Checkbox></TableHead>
      <TableHead className="w-[100px]" onClick={()=>handleSort('date')}>
        <div className='flex items-center'>
            Date{" "} {sortConfig.field==='date' && (
              sortConfig.direction==='asc' ? (
                <ChevronUp className='ml-1 h-4 w-4'></ChevronUp>
              ):(
                <ChevronDown className='ml-1 h-4 w-4'></ChevronDown>
              )
            )}
        </div>
      </TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Category</TableHead>
      <TableHead className="text-right" onClick={()=>handleSort('amount')}>
      <div className='flex items-center'>
            Amount{" "} {sortConfig.field==='amount' && (
              sortConfig.direction==='asc' ? (
                <ChevronUp className='ml-1 h-4 w-4'></ChevronUp>
              ):(
                <ChevronDown className='ml-1 h-4 w-4'></ChevronDown>
              )
            )}
        </div>
      </TableHead>
      <TableHead className="text-right">Recurring</TableHead>

      
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow> */}
    {     ( !transaction_data || (transaction_data && transaction_data.length===0)) ? (<TableRow className='text-muted-foreground w-full'><TableCell colSpan={6} className="text-muted-foreground text-center">
        No transactions found...
      </TableCell></TableRow>):
            (transaction_data.map((item,index)=>{
                return (
                
                <TableRow key={index}>
                        <TableCell><Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={()=>handleSelect(item.id)}></Checkbox></TableCell>
                        <TableCell className="font-medium text-left">{format(new Date(item.date),'PP')}</TableCell>
                        <TableCell>{item.description}{item.recurringInterval && ("(recurring)")}</TableCell>
                        <TableCell className='capitalize'><span style={{backgroundColor:categoryColors[item.category]}} className='text-white p-2 rounded-md'>{item.category}</span></TableCell>
                        <TableCell className={`${item.type==='EXPENSE'?'text-red-500':'text-green-600'} text-right font-bold`}>{item.type==='EXPENSE'?'-':'+'}{item.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                        {item.isRecurring ? (
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger>
                                        <Badge
                                        variant="secondary"
                                        className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                        >
                                        <RefreshCw className="h-3 w-3" />
                                        {
                                            RecurringInterval[
                                            item.recurringInterval
                                            ]
                                        }
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-sm">
                                        <div className="font-medium">Next Date:</div>
                                        <div>
                                            {format(
                                            new Date(item.nextRecurringDate),
                                            "PPP"
                                            )}
                                        </div>
                                        </div>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                    ) : (
                                    <Badge variant="outline" className="gap-1">
                                        <Clock className="h-3 w-3" />
                                        One-time
                                    </Badge>
                    )}
                        </TableCell>
                        <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${item.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                        onClick={() => deleteFn([item.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                )
                
            }))
        }
  </TableBody>
</Table>

        </div>
         
    </div>
  )
}

export default Transaction_table