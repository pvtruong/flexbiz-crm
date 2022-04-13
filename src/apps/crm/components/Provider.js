// eslint-disable-next-line no-unused-vars
import React from 'react';
import Provider from "flexbiz-core/components/auth/Provider";
import {EmitEvents} from "flexbiz-core/utils";
import {toast } from 'react-toastify';
class CapProvider extends Provider{
    registerSocketEvents(socket,user){
      let _this = this;
        socket.on('account.changed', function(account) {
            EmitEvents.dispatch('account.changed:' + account,account)
            toast.info(_this.state.apis.getLabel("Số dư trong ví của bạn đã được cập nhật"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
              EmitEvents.dispatch('open.page',"/wallets")
            }})
          });
          socket.on('tx.hash', function(data) {
            EmitEvents.dispatch('tx.completed',data.txhash)
            EmitEvents.dispatch('tx.completed:' + data.txhash,data)
          });
          socket.on('message.action', function(data) {
            if(!data.logs[0].success) return;
            //
            data.action.forEach(async action=>{
              EmitEvents.dispatch('message.action:' + action,data)
              //event for task
              if(data.tx.msg[0].value.id_task){
                EmitEvents.dispatch('message.action:' + action + ":" + data.tx.msg[0].value.id_task ,data)
                EmitEvents.dispatch('task.changed:' + data.tx.msg[0].value.id_task ,data)
    
                if(action==="choose_apply" && data.logs[0].success){
                  EmitEvents.dispatch('task.apply.choise:' + data.tx.msg[0].value.id_task ,data)
                }
              }
              if(action==="create_task"){
                EmitEvents.dispatch('task.new',data.tx.msg[0].value.id);
                toast.info(`${_this.state.apis.getLabel("Công việc mới")}: ${data.tx.msg[0].value.title}`,{hideProgressBar:true,autoClose: 5000,onClick:()=>{
                  EmitEvents.dispatch('task.new.click',data.tx.msg[0].value.id);
                }})
              }
              if(action==="cancle_task" || action==="cancel_task"){
                EmitEvents.dispatch('task.changed:' + data.tx.msg[0].value.id ,data)
              }
            })
          });
          socket.on(`${user.email}.send`, function(msg) {
            if(msg.logs.length===1){
              if(msg.logs[0].success){
                toast.success(_this.state.apis.getLabel("Giao dịch của bạn đã được thực hiện xong"),{hideProgressBar:true,autoClose: 3000})
              }else{
                let error = msg.logs[0].log.message;
                toast.error(error,{hideProgressBar:true,autoClose: 2000})
              }
            }
          });
          socket.on(`${user.email}.receive`, function(msg) {
            if(msg.logs.length===1 && msg.logs[0].success){
              switch (msg.tx.msg[0].type) {
                case "task/MsgCreateApply":
                  toast.success(_this.state.apis.getLabel("Có đăng ký mới cho công việc của bạn"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
                    EmitEvents.dispatch('task.new.click',msg.tx.msg[0].value.id_task)
                  }})
                  break;
                case "task/MsgChooseApply":
                  toast.success(_this.state.apis.getLabel("Đăng ký của bạn đã được chọn"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
                    EmitEvents.dispatch('task.new.click',msg.tx.msg[0].value.id_task)
                  }})
                  break;
                case "task/MsgRequireCheckResult":
                  toast.success(_this.state.apis.getLabel("Công việc của bạn đã được thực hiện xong. Hãy kiểm tra kết quả"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
                    EmitEvents.dispatch('task.new.click',msg.tx.msg[0].value.id_task)
                  }})
                  break;
                case "task/MsgConfirmTaskCompleted":
                  toast.success(_this.state.apis.getLabel("Đã xác nhận công việc hoàn thành"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
                    EmitEvents.dispatch('task.new.click',msg.tx.msg[0].value.id_task)
                  }})
                  break;
                case "task/MsgTaskNotComplete":
                  toast.success(_this.state.apis.getLabel("Không xác nhận công việc hoàn thành"),{hideProgressBar:true,autoClose: 3000,onClick:()=>{
                    EmitEvents.dispatch('task.new.click',msg.tx.msg[0].value.id_task)
                  }})
                  break;
                default:
    
              }
            }
          });
    }
}
export default CapProvider;