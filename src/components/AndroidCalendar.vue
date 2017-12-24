<template>
    <div>
        <input type="hidden" id='calendar'>
        <input type="hidden" id='startDate'>
        <input type="hidden" id='endDate'>
    </div>
</template>

<script>
import {getCurrentMonthFirst,getCurrentMonthLast} from '../utils/utils'
import commonApi from'../Api/androidApi'
export default{
    mounted(){
      var instance,
      now = new Date(),
      max = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
      instance = mobiscroll.range('#calendar', {
          theme: 'material',
          lang: 'zh',
          display: 'center',
          layout: 'liquid',
          controls: ['calendar'],
          defaultValue: [ getCurrentMonthFirst(), getCurrentMonthLast() ],
          startInput: '#startDate',
          endInput: '#endDate',
          dateFormat:'yy-mm-dd',
          onSet:function(even,inst){
              //点击确定以后的结果
            let startTime = $('#startDate').val()+'00:00:00';
            let endTime = $('#endDate').val() + '23:59:59';
            commonApi.androidApi.log('time',startTime,endTime);
            commonApi.androidApi.onSetTimeSuccess(startTime,endTime)
          },
          onCancel:function(){
            commonApi.androidApi.onSetTimeCancel();
          }
      });
      instance.show();
    }
}
</script>

<style>
</style>
