import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
  const dispatch = useDispatch();
  const { totalOrder, myOrders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(100); // Default to 100 rows

  // Fetch orders when params change
  useEffect(() => {
    dispatch(
      get_seller_orders({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue, // Pass searchValue to backend for filtering
        sellerId: userInfo._id,
      })
    );
  }, [parPage, currentPage, searchValue, userInfo._id, dispatch]);

  // Filter orders locally if backend doesn't support search
  const filteredOrders = searchValue
    ? myOrders.filter((order) => order._id.includes(searchValue))
    : myOrders;

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center mb-4">
          {/* Rows per page dropdown */}
          <select
            value={parPage}
            onChange={(e) => {
              setParPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="px-4 py-2 focus:border-green-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>

          {/* Search box */}
          <input
            className="px-4 py-2 focus:border-green-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            type="text"
            placeholder="Search Order ID"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>

        {/* Orders Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="font-bold py-3 px-4">Order ID</th>
                <th scope="col" className="font-bold py-3 px-4">Price</th>
                <th scope="col" className="font-bold py-3 px-4">Payment Status</th>
                <th scope="col" className="font-bold py-3 px-4">Order Status</th>
                <th scope="col" className="font-bold py-3 px-4">Date</th>
                <th scope="col" className="font-bold py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{order._id}</td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">₱{order.price}</td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <span>{order.payment_status}</span>
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <span>{order.delivery_status}</span>
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{order.date}</td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <Link
                      to={`/seller/dashboard/order/details/${order._id}`}
                      className="p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalOrder > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
