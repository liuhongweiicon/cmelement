<template>
    <div class="cm-answerCard" @click.stop>
        
        <div class="cm-answerCard-stem">
            <div 
                class="answerCard-stem-cell"
                v-for="(item, index) in paperDetails"
                :key="item.bigId"
                >
                <div class="stem-cell-title">
                    <span>{{ `${ArabelToCN(index + 1)}、${item.bigTitle}(${item.anserNum}/${item.smallQuestions.length})`}}</span>
                    <div class="cell-title-order">
                        <span 
                            class="cell-title-order-item" 
                            :class="{'order-item-active': ele.hasAnswer}" 
                            v-for="(ele, inx) in (item.smallQuestions)" 
                            :key="ele.smallId"
                            @click="switchHandler(index, inx)"
                            >{{inx +1}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="cm-answerCard-footer" @click="submitToHandler">提交</div>
    </div>
</template>

<script>
export default {
    name: 'cm-answer-card',
    props: {
        paperDetails: {
            type: Array,
            defalut: () => {
                return [];
            }
        }
    },
    methods: {
        /**
         * 根据题号切换到该题
         */
        switchHandler(bigInx, smallInx) {
            let num = 0;
            this.paperDetails.forEach((item, index) => {
                if (index < bigInx) {
                    num += item.smallQuestions.length;
                }
            });
            num += smallInx;
            this.$emit("switch", num);
        },

        /**
         * 点击提交
         */
        submitToHandler() {
            this.$emit("submit");
        }
    }
}
</script>

<style lang="scss" scoped>
.cm-answerCard {
    position: absolute;
    width: 232px;
    padding: 20px 14px 0;
    right: 0;
    margin-top: 20px;
    background: #ffffff;
    border: 1px solid #EBEBEB;
    box-shadow: 0px 3px 9px 0px rgba(194, 194, 194, 0.38);
    border-radius: 10px;
    z-index: 499;
    text-align: left;
    .cm-answerCard-stem {
        .answerCard-stem-cell {
            .stem-cell-title {
                font-size: 14px;
                font-weight: 400;
                color: #3C3C3C;
                .cell-title-order {
                    .cell-title-order-item {
                        display: inline-block;
                        width: 34px;
                        height: 34px;
                        line-height: 34px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 400;
                        background: #FFFFFF;
                        border: 1px solid #EBEBEB;
                        box-sizing: border-box;
                        margin-right: 10px;
                        text-align: center;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                    .order-item-active {
                        color: #FFFFFF;
                        background: var(--color1);
                    }
                }
            }
        }
    }
    .cm-answerCard-footer {
        margin-top: 20px;
        border-top: 1px solid #EBEBEB;
        height: 45px;
        line-height: 45px;
        user-select: none;
        text-align: center;
    }
}
@media screen and (min-width: 760px) and (max-width: 850px) {
    
        .cm-answerCard {
            .answerCard-stem-cell {
                .stem-cell-title {
                    span {
                        font-size: 24px !important;
                    }
                    .cell-title-order {
                        .cell-title-order-item {
                            font-size: 24px !important;
                            width: 50px !important;
                            height: 50px !important;
                            line-height: 50px !important;
                            
                        }
                    }
                }
            }
            .cm-answerCard-footer {
                width: 525px !important;
                height: 70px !important;
                background: #2780D0 !important;
                border-radius: 15px !important;
                line-height: 70px !important;
                margin: 0 auto 40px auto !important;
                position: relative !important;
                color: #FEFEFE !important;
                font-size: 24px !important;
            }
        }
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    
        .cm-answerCard {
            .answerCard-stem-cell {
                .stem-cell-title {
                    span {
                        font-size: 19px !important;
                    }
                    .cell-title-order {
                        .cell-title-order-item {
                            font-size: 19px !important;
                            width: 40px !important;
                            height: 40px !important;
                            line-height: 40px !important;
                            margin-bottom: 10px !important;
                            
                        }
                    }
                }
            }
            .cm-answerCard-footer {
                width: 230px !important;
                height: 45px !important;
                background: #2780D0 !important;
                border-radius: 15px !important;
                line-height: 45px !important;
                margin: 10px auto 20px auto !important;
                position: relative !important;
                color: #FEFEFE !important;
                font-size: 19px !important;
            }
        }
}
@media screen and (max-width: 1024px) {
    .cm-answerCard {
        margin-top: 0px;
        border: none;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        display: flex;
        flex-direction: column;
        .cm-answerCard-stem {
            flex: 1;
            padding: 15px;
            height: 0;
            overflow-x: auto;
            .answerCard-stem-cell {
                .stem-cell-title {
                    .cell-title-order {
                        .cell-title-order-item {
                            margin: 10px;
                        }
                    }

                }
            }
            &::-webkit-scrollbar {
                width: 2px;
            }
        }
        .cm-answerCard-footer {
            margin-top: 0;
        }
    }
}
</style>