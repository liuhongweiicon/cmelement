<!--
 * @Description: IM聊天室
-->
<template>
  <div class="message-box" :class="{'message-box-wrap': isMessage}">
    <div class="message-box-content" >
      <div class="title" @click="messageHandler">
        <span> 讨论区</span>
        <span class="title-tips" v-if="numberUnread">{{numberUnread}}条未读</span>
      </div>
      <div class="message-list" ref="messageList">
        <div
          v-for="item of messages"
          :key="item.messageID || item.messageTimestamp"
          :class="[
            item.userID == user.uid ? 'isMe' : '',
            item.messageCategory === 1 ? 'item' : 'state-item',
          ]"
        >
          <!--用户发送普通消息 messageCategory == 1 -->
          <div class="name" v-if="item.messageCategory == 1 && item.userID != user.uid">
            {{ item.nick_name }}
          </div>
          <!--用户进入房间系统消息 messageCategory == 2 -->
          <div class="text" v-if="item.messageCategory !== 1">
            {{ item.userID == user.uid ? '我' : item.nick_name }} {{ item.messageContent[0] }}
          </div>
          <div class="text-box" v-if="item.messageCategory === 1">
            <div v-for="(item, i) of item.messageContent" :key="i" class="text-item">
              <!--消息状态 messageState = 1 发送中 -->
              <div class="loading-box" v-show="item.messageState === 1">
                <i class="fade-item fade-item1"></i>
                <i class="fade-item fade-item2"></i>
                <i class="fade-item fade-item3"></i>
                <i class="fade-item fade-item4"></i>
                <i class="fade-item fade-item5"></i>
                <i class="fade-item fade-item6"></i>
                <i class="fade-item fade-item7"></i>
                <i class="fade-item fade-item8"></i>
                <i class="fade-item fade-item9"></i>
                <i class="fade-item fade-item10"></i>
                <i class="fade-item fade-item11"></i>
                <i class="fade-item fade-item12"></i>
              </div>
              <!--消息状态 messageState = 2 发送失败 -->
              <!--消息状态 messageState = 3 发送成功 -->
              <el-tooltip class="item" effect="dark" content="消息发送失败" placement="top">
                <div
                  class="icon icon-fail"
                  v-show="item.messageState === 2"
                  v-html="require('../../../static/img/roomIcon/discuss_fail.svg').default"
                ></div>
              </el-tooltip>
              <p class="text">{{ item.content }}</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="send">
      <textarea
        class="send-textarea"
        maxlength="100"
        placeholder="请输入..."
        v-model="textareaValue"
        @keyup.enter="enterToSend"
      ></textarea>
      <div class="send-tool-box">
        <div class="input-warn">
          <div class="input-warn-tip" v-show="textareaValue.length === 200">
            <div
              class="icon"
              v-html="require('../../../static/img/roomIcon/input_error.svg').default"
            ></div>
            最多输入100个字符
          </div>
        </div>

        <button class="btn" @click="send" :disabled="isDisabled">发送(S)</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoomChattingList',
  inject: ['zegoLiveRoom'],
  components: {},
  data() {
    return {
      user: {}, // 用户信息
      textareaValue: '',
      sendTime: 0,
      clientHeight: 0, //im初始高度
      isMessage: false, // 聊天列表展示条件
      numberUnread: 0, // 未读信息条数

    }
  },
  computed: {
    messages() {
      return this.zegoLiveRoom.messages
    },
    isDisabled() {
      return !this.textareaValue
    },
  },
  watch: {
    messages: {
      handler(val, newVal) {
        if (!this.isMessage) {
          this.numberUnread++;
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.user = this.zegoLiveRoom.$http.params // 用户信息
    BUS.$on('imAttendeesChange', this.onIMAttendeesChange)
    // 获取初始高度值
    this.clientHeight = this.$refs.messageList.clientHeight
  },
  updated() {
    // 聊天定位到底部
    this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight
  },
  destroyed() {},
  methods: {
    /**
     * @desc: 监听im成员变化
     * @param {*} res
     * @return {*}
     */
    onIMAttendeesChange(res) {
      let data = {
        userID: res.users.uid,
        messageCategory: 2,
        messageContent: res.delta === 1 ? ['加入课堂'] : ['退出课堂'],
        messageState: 1,
        nick_name: res.users[0].nick_name,
      }
      this.zegoLiveRoom.setRoomMessage(1, data)
    },
    /**
     * @desc: 回车发送消息
     */
    async enterToSend() {
      if (this.sendTime && new Date().getTime() - this.sendTime < 300) {
        this.showToast('消息发送过于频繁')
        return
      }
      
      this.isMessage = true;
      // 除掉回车换行符
      let textareaValue = this.textareaValue.replace(/[\r\n]/g, '')
      this.textareaValue = ''
      if (textareaValue) {
        this.sendMessage(textareaValue)
      } else {
        this.textareaValue = ''
        this.showToast('消息不能为空')
      }
    },
    /**
     * @desc: 点击发送按钮发送消息
     */
    send() {
      if (this.sendTime && new Date().getTime() - this.sendTime < 300) {
        this.showToast('消息发送过于频繁')
        return
      }
      this.isMessage = true;
      let message = this.textareaValue
      this.textareaValue = ''
      this.sendMessage(message)
    },
    /**
     * @desc: 发送消息
     */    
    async sendMessage(message){
      try {
        await this.zegoLiveRoom.sendBarrageMessage(message);
      } catch (e) {
        this.showToast('消息发送失败')
      }
      this.sendTime = new Date().getTime()
      this.$nextTick(() => {
        this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight - this.clientHeight
      })
    },

    /**
     * @desc: 展开收起聊天列表
     */
    messageHandler() {
      this.isMessage = !this.isMessage;
      this.numberUnread = 0;
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../../static/css/room/_mixin.scss';
.message-box {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 200px;
  overflow: hidden;
  background-color: #fbfcff;
  padding-right: 2px;
  .message-box-content {
    
    .title {
      height: 38px;
      @include sc(14px, #333333);
      line-height: 38px;
      box-sizing: border-box;
      background:#F4F5F8;
      border-bottom: 1px solid#E5E6E7;
      border-top: 1px solid#E5E6E7;
      position: relative;
      padding-left: 40px;
      .title-tips {
        display: inline-block;
        margin-left: 10px;
        background: #ff9d9d;
        height: 20px;
        width: 86px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 20px;
        line-height: 20px;
        text-align: center;
        color: #333333;
        font-size: 12px;
      }
      &:hover {
        cursor: pointer;
      }
      &::after, &::before {
        border: 6px solid transparent;
        border-top: 6px solid #F4F5F8;
        width: 0;
        height: 0;
        position: absolute;
        left: 15px;
        top: 14px;
        content: ' '
      }
      &::before {
        border-top-color: #999999;
        top: 16px;
      }
    }
    .message-list {
      position: relative;
      box-sizing: border-box;
      padding: 0 10px;
      overflow: auto;
      flex-grow: 1;
      user-select: text;
      @include wh(100%, 0px);

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        padding-right: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(177, 180, 188, 0.5);
        border-radius: 2px;
      }
      .item {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        font-weight: 400;
        .name {
          margin-bottom: 1px;
          line-height: 18px;
          color: #86888c;
          text-align: left;
        }
        .text-box {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .text-item {
          display: flex;
          align-items: center;
        }
        .text {
          margin: 4px 0;
          padding: 9px 12px;
          width: fit-content;
          max-width: 181px;
          background-color: #fff;
          color:  #333333;
          
          line-height: 18px;
          border-radius: 2px 16px 16px 16px;
          word-break: break-all;
          border: 1px solid #f3f3f3;
          p {
            margin: 0;
          }
        }

        &.isMe {
          position: relative;
          .text-box {
            align-items: flex-end;
          }
          .text {
            margin: 4px 0;
            border-radius: 16px 2px 16px 16px;
            color: #333333;
          }
          .loading-box {
            position: relative;
            @include wh(18px, 18px);
            margin: 0 auto;
            margin-right: 6px;
            .fade-item {
              position: absolute;
              top: 0;
              left: 0;
              @include wh(18px, 18px);
              &:before {
                content: '';
                display: block;
                margin: 0 auto;
                @include wh(1px, 5px);
                background-color: #bcbfc5;
                border-radius: 2px;
                -webkit-border-radius: 2px;
                animation: fadeDelay 1.2s infinite ease-in-out both;
              }
            }
            .fade-item2 {
              transform: rotate(30deg);
              &:before {
                animation-delay: -1.1s; //注意animation-delay负值指跳过1.1s进入动画
              }
            }
            .fade-item3 {
              transform: rotate(60deg);
              &:before {
                animation-delay: -1s;
              }
            }
            .fade-item4 {
              transform: rotate(90deg);
              &:before {
                animation-delay: -0.9s;
              }
            }
            .fade-item5 {
              transform: rotate(120deg);
              &:before {
                animation-delay: -0.8s;
              }
            }
            .fade-item6 {
              transform: rotate(150deg);
              &:before {
                animation-delay: -0.7s;
              }
            }
            .fade-item7 {
              transform: rotate(180deg);
              &:before {
                animation-delay: -0.6s;
              }
            }
            .fade-item8 {
              transform: rotate(210deg);
              &:before {
                animation-delay: -0.5s;
              }
            }
            .fade-item9 {
              transform: rotate(240deg);
              &:before {
                animation-delay: -0.4s;
              }
            }
            .fade-item10 {
              transform: rotate(270deg);
              &:before {
                animation-delay: -0.3s;
              }
            }
            .fade-item11 {
              transform: rotate(300deg);
              &:before {
                animation-delay: -0.2s;
              }
            }
            .fade-item12 {
              transform: rotate(330deg);
              &:before {
                animation-delay: -0.1s;
              }
            }
            @keyframes fadeDelay {
              0%,
              39%,
              100% {
                opacity: 0.2;
              }
              40% {
                opacity: 1;
              }
            }
            @-webkit-keyframes fadeDelay {
              0%,
              39%,
              100% {
                opacity: 0.2;
              }
              40% {
                opacity: 1;
              }
            }
          }
          .icon {
            margin-right: 6px;
            @include wh(16px, 16px);
          }
        }
        &.message-list-teacher {
          .text {

          }
        }
      }
      .state-item {
        padding: 7px 0;
        text-align: center;
        line-height: 12px;
        @include sc(12px, #86888c);
        .name {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
          max-width: 145px;
        }
        .text {
          display: inline-block;
        }
      }
    }
  }
  .send {
    @include wh(100%, 162px);
    padding: 14px 0;
    padding-right: 2px;
    box-sizing: border-box;
    // border-top: 1px solid #edeff3;
    .send-textarea {
      padding: 0 14px;
      resize: none;
      @include wh(228px, 92px);
      @include sc(12px, #333333);
      background-color: transparent;
      border: none;
      word-break: break-all;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        padding-right: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(177, 180, 188, 0.5);
        border-radius: 2px;
      }
      &:focus {
        outline: none;
      }
    }
    .send-textarea {
      &::-webkit-input-placeholder {
        color: #999999;
      }
    }
    .send-tool-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;
      .input-warn {
        display: flex;
        &-tip {
          display: flex;
          height: 12px;
          @include sc(12px, #f64326);
          margin-left: 14px;
          line-height: 12px;
          .icon {
            margin-right: 4px;
            @include wh(12px, 12px);
          }
        }
      }
      .btn {
        padding: 0;
        border: 0;
        text-align: center;
        @include wh(76px, 36px);
        @include sc(12px, #edf1fa);
        border-radius: 4px;
        background-color: #4B7AFB;
        line-height: 36px;
        &:hover {
          cursor: pointer;
          background-color:#4B7AFB;
          @include box-shadow(0 0 10px 2px rgba($color: #4B7AFB, $alpha: 0.02));
        }
        &:active {
          background-color: #4B7AFB;
        }
        &:focus {
          outline: none;
        }
        &:disabled {
          cursor: not-allowed;
          background-color: #9BB0F7;
          color: #ffffff;
        }
      }
    }
  }
}
.message-box-wrap {
  height: 70%;
  .message-box-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0;
    overflow: auto;
    .title {
      &::after, &::before {
        border-top-color: transparent;
        border-bottom: 6px solid#F4F5F8;
        top: 10px;
        content: ' '
      }
      &::before {
        border-bottom-color: #999999;
        top: 8px;
      }
    }
  }
  .send {
    border-top: 1px solid#E5E6E7;
    height: 163px;
  }
}
</style>
