import React, { Component } from 'react'
import dataKeyPad from '../Data/dataKeyPad.json'
import './Calculator.css'

export default class Calculator extends Component {
    state = {
        operator: null,
        firstOperand: 0,
        secondOperand: 0,
        displayedResult: 0,
        isOperatorKeyPressed: false,
        isCalculationExecuted: false,
        isInit: true
    }

    renderKeyPad = () => {
        let keypad = dataKeyPad.map((item, index) => {
            return (
                <button key={index} type="button" value={item.value} className={item.className}
                    onClick={() => { eval(item.method) }} >
                    {item.value}
                </button>
            )
        });

        return keypad;
    }

    inputNumber = (numberKeyValue) => {
        let newState = {};
        if (!this.state.isOperatorKeyPressed) {
            if (this.state.isInit) {
                if (!this.state.isCalculationExecuted) {
                    newState = {
                        firstOperand: numberKeyValue,
                        secondOperand: numberKeyValue,
                        displayedResult: numberKeyValue,
                        isInit: false
                    }
                }
                else {
                    newState = {
                        firstOperand: numberKeyValue,
                        displayedResult: numberKeyValue,
                        isInit: false
                    }
                }
            }
            else {
                let inputNumber = 0;
                let inputString = `${this.state.displayedResult}${numberKeyValue}`;
                if (inputString.indexOf(".") === -1) {
                    inputNumber = parseInt(inputString);
                }
                else {
                    let decimalPartLength = inputString.substring(inputString.indexOf(".") + 1).length;
                    inputNumber = parseFloat(inputString).toFixed(decimalPartLength);
                }

                if (!this.state.operator || this.state.isCalculationExecuted) {
                    newState = {
                        firstOperand: inputNumber,
                        displayedResult: inputNumber
                    }
                }
                else {
                    newState = {
                        secondOperand: inputNumber,
                        displayedResult: inputNumber
                    }
                }
            }
        }
        else {
            newState = {
                secondOperand: numberKeyValue,
                displayedResult: numberKeyValue,
                isOperatorKeyPressed: false,
                isInit: false
            }
        }
        this.setState(newState);
    }

    inputDecimalPoint = (decimalPoint) => {
        let newState = {};
        if (!this.state.isInit) {
            if (`${this.state.displayedResult}`.indexOf(".") === -1) {
                newState = {
                    displayedResult: `${this.state.displayedResult}${decimalPoint}`,
                    isOperatorKeyPressed: false
                }
            }
        }
        else {
            newState = {
                displayedResult: `0${decimalPoint}`,
                isOperatorKeyPressed: false,
                isInit: false
            }
        }

        this.setState(newState);
    }

    inputOperator = (operatorKeyValue) => {
        let newState = {};
        if (!this.state.isOperatorKeyPressed) {
            if (this.state.operator && !this.state.isCalculationExecuted) {
                let result = this.operators[this.state.operator](parseFloat(this.state.firstOperand), parseFloat(this.state.secondOperand));
                newState = {
                    operator: operatorKeyValue,
                    firstOperand: result,
                    secondOperand: result,
                    displayedResult: result,
                    isOperatorKeyPressed: true,
                    isInit: true
                }
            }
            else {
                newState = {
                    secondOperand: this.state.displayedResult,
                    operator: operatorKeyValue,
                    isOperatorKeyPressed: true,
                    isCalculationExecuted: false,
                    isInit: true
                }
            }
        }
        else {
            newState = {
                operator: operatorKeyValue
            }
        }
        this.setState(newState);
    }

    operators = {
        '+': function (x, y) { if (!isNaN(x) && !isNaN(y)) { return x + y } else { return "Error" } },
        '-': function (x, y) { if (!isNaN(x) && !isNaN(y)) { return x - y } else { return "Error" } },
        '*': function (x, y) { if (!isNaN(x) && !isNaN(y)) { return x * y } else { return "Error" } },
        '/': function (x, y) { if (!isNaN(x) && !isNaN(y) && y !== 0) { return x / y } else { return "Error" } },
    }

    executeCalculation = () => {
        let newState = {};
        if (!this.state.isOperatorKeyPressed) {
            if (this.state.operator) {
                let result = this.operators[this.state.operator](parseFloat(this.state.firstOperand), parseFloat(this.state.secondOperand));
                if (!this.state.isCalculationExecuted) {
                    newState = {
                        isCalculationExecuted: true,
                        firstOperand: result,
                        displayedResult: result,
                        isInit: true
                    }
                }
                else {
                    newState = {
                        firstOperand: result,
                        displayedResult: result,
                        isInit: true
                    }
                }
            }
        }
        else {
            let result = this.operators[this.state.operator](parseFloat(this.state.firstOperand), parseFloat(this.state.firstOperand));
            newState = {
                isCalculationExecuted: true,
                isOperatorKeyPressed: false,
                firstOperand: result,
                secondOperand: this.state.firstOperand,
                displayedResult: result,
                isInit: true
            }
        }
        this.setState(newState);
    }

    clearAll = () => {
        let newState = {
            operator: null,
            firstOperand: 0,
            secondOperand: 0,
            displayedResult: 0,
            isOperatorKeyPressed: false,
            isCalculationExecuted: false,
            isInit: true
        }

        this.setState(newState);
    }

    clearLatestInput = () => {
        let newState = {
            secondOperand: 0,
            displayedResult: 0,
            isOperatorKeyPressed: false,
            isCalculationExecuted: false,
            isInit: true
        }

        this.setState(newState);
    }

    render() {
        return (
            <div className="container">
                <div className="calculator">
                    <input type="text" className="calculator-screen" value={this.state.displayedResult} disabled />
                    <div className="calculator-keypad">
                        {this.renderKeyPad()}
                    </div>
                </div>
            </div>
        )
    }
}
