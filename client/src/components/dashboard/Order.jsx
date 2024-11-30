import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { get_order } from "../../store/reducers/orderReducer";

const Order = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_order(orderId));
  }, [orderId]);

  return (
    <div className="bg-white p-5">
      <h2 className="text-slate-600 font-semibold">
        Order ID: {myOrder._id} 
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-600 font-semibold">
            Date of Order: {myOrder.date}
          </h2> 
          <p>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Address
            </span>
            <br />
            <span className="text-slate-600 text-sm">
            {myOrder.shippingInfo?.area}, {myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.city}, {myOrder.shippingInfo?.province}{" "}
              
            </span>
          </p>
          <p className="text-slate-600 text-sm font-semibold">
            Email to {userInfo.email}
          </p>
        </div>
        <div className="text-slate-600">
          <h2>Price: ₱{myOrder.price}</h2>
          <p>
            Payment Status:{" "}
            <span
              className={`py-[1px] text-xs px-3 ${
                myOrder.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-md `}
            >
              {myOrder.payment_status}
            </span>
          </p>
          <p>
            Order Status:{" "}
            <span
              className={`py-[1px] text-xs px-3 ${
                myOrder.delivery_status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-md `}
            >
              {myOrder.delivery_status}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="text-slate-600 text-lg pb-2">Products</h2>
        <div className="flex gap-5 flex-col">
          {myOrder.products?.map((p, i) => (
            <div key={i}>
              <div className="flex gap-5 justify-start items-center text-slate-600">
                <div className="flex gap-2">
                  <img
                    className="w-[55px] h-[55px]"
                    src={p.images[0]}
                    alt="image"
                  />
                  <div className="flex text-sm flex-col justify-start items-start">
                    <Link>{p.name}</Link>
                    <p>
                      <span>Brand: {p.brand}</span>
                      
                    </p>
                    <p>
                    <span>Quantity: {p.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="pl-4">
                  <p>{p.price}</p>
                  <p>-{p.discount}%</p>
                  <h2 className="text-md text-green-500">
                  ₱{p.price - Math.floor((p.price * p.discount) / 100)}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
