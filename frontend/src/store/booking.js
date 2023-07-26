import {csrfFetch} from "./csrf";

const LOAD_ORDER = "orders/LOAD_ORDER";
const ADD_ORDER = "orders/ADD_ORDER";
const UPDATE_ORDER = "orders/UPDATE_ORDER";
const REMOVE_ORDER = "orders/REMOVE_ORDER";


const loadOrder = (orders) => ({
    type: LOAD_ORDER,
    orders
});

const addNewOrder = (order) => ({
    type: ADD_ORDER,
    order
});

const updateOrder = (order) => ({
    type: UPDATE_ORDER,
    order
});

const removeOrder = (orderId) => ({
    type: REMOVE_ORDER,
    orderId
});

export const allOrders = () => async dispatch => {
    const res = await csrfFetch("/api/orders/current");
    const orders = await res.json();

    dispatch(loadOrder(orders));
};

export const addOrder = (order, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addNewOrder(data));
        return data;

    }
};

export const deleteOrder = (id) => async dispatch => {
    const res = await fetch(`/api/orders/remove/${id}`, {
        method: "POST"
    });
    if (res.ok) {
        // dispatch(removeSpot(id));
        dispatch(removeOrder(id));
    }
}

export const orderUpdate = (id, ques) => async dispatch => {
    const res = await fetch(`/api/orders/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ques)
    });

    if (res.ok) {

        const updateQues = await res.json()

        dispatch(updateOrder(updateQues))
        return res
    }
}

const orderReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ORDER:
            const newState = {};
            action.orders.forEach(ele => newState[ele.id] = ele);
            return { ...state, ...newState }
        case ADD_ORDER:
            const np = {};
            np[action.order.id] = action.order;
            return { ...state, ...np }
        case UPDATE_ORDER:
            return { ...state, [action.order.id]: action.order }
        case REMOVE_ORDER:
            const nState = { ...state };

            delete nState[action.orderId];
            return nState
        default:
            return state
    }
};

export default orderReducer