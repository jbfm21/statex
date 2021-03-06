import { STATEX_ACTION_KEY, STATEX_DATA_BINDINGS_KEY } from './constance'

import { Action } from './action'
import { DataObserver } from '../@angular'
import { Observable } from 'rxjs/Observable'
import { State } from './state'
import { StateSelector } from './state-selector'
import { Subscription } from 'rxjs/Subscription'

declare var Reflect: any

/**
 * Bind data for give key and target using a selector function
 *
 * @param {any} target
 * @param {any} key
 * @param {any} selectorFunc
 */
export function bindData(target: any, key: string, selector: StateSelector): Subscription {
  return State.select(selector)
    .subscribe(data => {
      if (typeof target.setState === 'function') {
        let state = {}
        state[key] = data
        target.setState(state)
      }
      if (typeof target[key] === 'function') return target[key].call(target, data)
      target[key] = data
    })
}

/**
 * Binds action to a function
 *
 * @example
 * class TodoStore {
 *
 *    @action
 *    addTodo(state: State, action: AddTodoAction): State {
 *       // return modified state
 *    }
 * }
 *
 * @export
 * @param {*} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns
 */
export function action(targetAction?: Action) {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): Promise<any> | Observable<any> | any => {

    if (targetAction == undefined) {
      let metadata = Reflect.getMetadata('design:paramtypes', target, propertyKey)
      if (metadata.length < 2) throw new Error('@action() must be applied to a function with two arguments. ' +
        'eg: reducer(state: State, action: SubclassOfAction): State { }')
      targetAction = metadata[1]
    }
    let refluxActions = {}
    if (Reflect.hasMetadata(STATEX_ACTION_KEY, target)) {
      refluxActions = Reflect.getMetadata(STATEX_ACTION_KEY, target)
    }
    refluxActions[propertyKey] = targetAction
    Reflect.defineMetadata(STATEX_ACTION_KEY, refluxActions, target)

    return {
      value: function (state: any, action: Action): Observable<any> {
        return descriptor.value.call(this, state, action)
      }
    }
  }
}

/**
 * Add @data meta
 *
 * @export
 * @param {*} target
 * @param {any} propertyKey
 * @param {any} selector
 * @param {any} bindImmediate
 */
export function data(selector: StateSelector, bindImmediate?: boolean) {
  return (target: any, propertyKey: string) => {

    let metaTarget = target instanceof DataObserver ? target : target.constructor

    let bindingsMeta = Reflect.getMetadata(STATEX_DATA_BINDINGS_KEY, metaTarget)
    if (!Reflect.hasMetadata(STATEX_DATA_BINDINGS_KEY, metaTarget)) {
      bindingsMeta = { selectors: {}, subscriptions: [], destroyed: !bindImmediate }
    }

    bindingsMeta.selectors[propertyKey] = selector
    if (bindImmediate) {
      bindingsMeta.subscriptions.push(bindData(target, propertyKey, selector))
    }
    Reflect.defineMetadata(STATEX_DATA_BINDINGS_KEY, bindingsMeta, metaTarget)
  }
}

/**
 * Subscribe to the state events and map it to properties
 *
 * @export
 */
export function subscribe(propsClass) {
  let dataBindings = Reflect.getMetadata(STATEX_DATA_BINDINGS_KEY, propsClass || this)
  if (dataBindings != undefined && dataBindings.destroyed === true) {
    dataBindings.subscriptions = dataBindings.subscriptions.concat(
      Object.keys(dataBindings.selectors)
        .map(key => bindData(this, key, dataBindings.selectors[key]))
    )

    dataBindings.destroyed = false
    Reflect.defineMetadata(STATEX_DATA_BINDINGS_KEY, dataBindings, this)
  }
}

/**
 * Unsubscribe from the state changes
 *
 * @export
 */
export function unsubscribe() {
  let dataBindings = Reflect.getMetadata(STATEX_DATA_BINDINGS_KEY, this)
  if (dataBindings != undefined) {
    dataBindings.subscriptions.forEach(subscription => subscription.unsubscribe())
    dataBindings.subscriptions = []
    dataBindings.destroyed = true
    Reflect.defineMetadata(STATEX_DATA_BINDINGS_KEY, dataBindings, this)
  }
}