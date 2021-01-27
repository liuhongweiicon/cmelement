<!--
 * @Description: 文件列表弹窗组件
-->
<template>
  <div class="file-list-dialog">
    <el-dialog
      title="选择文件"
      :visible.sync="filesListDialogShow"
      width="460px"
      height="314px"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <ul class="file-list">
          <div class="file-list-nodata" v-if="!fileList.length">暂无分享文件，请先上传文件，再分享文件！</div>
          <li
            v-else
            class="file-item"
            v-for="item in fileList"
            :key="item.name + item.id"
            @click="createDocView(item.id)"
          >
            <div :class="['state', item.isDynamic && 'dynamic']">
              {{ item.isDynamic ? '动态' : '静态' }}
            </div>
            {{ item.name }}
          </li>
        </ul>
        <div class="tips">
          <div style="width:400px;">
            <span class="static">静态：无法展示PPT动画</span>
            <span class="dynamic">动态：可展示PPT动画</span>
          </div>
          <div class="fileInput">
             <label for="file-input">上传文件</label>
              <input type="file" accept=".docx, .doc, .xls, .xlsx, .pptx, .ppt, .potx, .pot" @change="changeHandler" id="file-input"  style="display: none;"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'RoomDialogFiles',
  inject: ['zegoWhiteboardArea'],
  data() {
    return {
      // fileList: [],
      waitting: false
    }
  },
  computed: {
    filesListDialogShow: {
      get() {
        return this.zegoWhiteboardArea.filesListDialogShow
      },
      set(val) {
        this.zegoWhiteboardArea.filesListDialogShow = val
      }
    },
    /**
     * @desc: 当前激活是否动态ppt
     */
    activeViewIsPPTH5() {
      return this.zegoWhiteboardArea.activeViewIsPPTH5
    },

    /**
     * 共享文件列表
     */
    fileList() {
      return this.zegoWhiteboardArea.fileLists
    }
  },
  async mounted() {
    // 根据登录页选择链接环境获取对应配置
    // const env = 'home'
    // const { fileList } = await this.zegoWhiteboardArea.client.context.Config.getParams(env)
    // this.$set(this, 'fileList', fileList)
    
  },
  methods: {
    /**
     * @desc: 创建共享文件
     * @param {id} 文件id
     */
    async createDocView(id) {
      const checkResult = this.zegoWhiteboardArea.checkViewFileMaxLength('file')
      if (checkResult) return this.showToast(checkResult)
      if (this.waitting) return
      this.waitting = true
      // 如果新建文件之前的是动态ppt，需手动停止该文件音视频
      if (this.activeViewIsPPTH5) this.zegoWhiteboardArea.stopPlay()
      this.zegoWhiteboardArea.setIsAllowSendRoomExtraInfo(true)
      await this.zegoWhiteboardArea.createFileView(id)
      this.waitting = false
      this.closeDialog()
    },
    closeDialog() {
      this.zegoWhiteboardArea.setFilesListDialogShow(false)
    },


    /**
     * 上传的文件
     */
    changeHandler() {
       var file = document.getElementById('file-input').files[0];
       this.zegoWhiteboardArea.docsClient.uploadFile(file, 1)
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../../static/css/room/_mixin.scss';
.file-list-dialog {
  /deep/ {
    .el-dialog__wrapper {
      padding-top: 12vh;
    }
    .el-dialog {
      width: 460px;
      height: 314px;
      border-radius: 6px;
    }
    .el-dialog__body {
      width: 460px;
      height: 271px;
      padding: 0;
      color: #18191a;
      font-size: 12px;
    }
    .el-dialog__title {
      @include sc(14px, #18191a);
    }
    .el-dialog-content ul {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .file-list {
      height: 220px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(177, 180, 188, 0.5);
        border-radius: 2px;
      }
      .file-list-nodata {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .file-list .file-item {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      color: #18191a;
      text-align: left;
      cursor: pointer;
      padding: 0 30px;

      &:hover {
        background: rgba(244, 245, 248, 1);
      }
    }
    .file-item .state {
      display: inline-block;
      width: 28px;
      height: 16px;
      border-radius: 4px;
      background-color: #0045ff;
      color: #fff;
      font-size: 10px;
      text-align: center;
      line-height: 16px;
      margin-right: 6px;

      &.dynamic {
        background-color: #ffa402;
      }
    }
    .el-dialog__header {
      width: 460px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      padding: 0;
    }
    .el-dialog__headerbtn {
      height: 12px;
      width: 12px;
      position: absolute;
      top: 16px;
      right: 16px;
    }
    .el-dialog__close {
      height: 12px;
      width: 12px;
    }
    .tips {
      width: 430px;
      height: 51px;
      text-align: left;
      font-size: 10px;
      color: #585c62;
      line-height: 51px;
      padding: 0 0 0 30px;
      border-top: 1px solid rgb(244, 245, 248);
      display: flex;
      .fileInput {
        width: 100px;
        color: #0045ff;
        text-align: center;
        label:hover  {
          cursor: pointer;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
    .tips .static {
      margin-right: 20px;
      line-height: 51px;
      height: 51px;
    }
  }
}
</style>
