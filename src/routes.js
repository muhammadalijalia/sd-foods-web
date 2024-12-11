import React from 'react';
import DeliveryOrders from './views/dashboard/sales/DeliveryOrders.js';

const Regions = React.lazy(() => import('./views/dashboard/region/Regions'));
const RegionForm = React.lazy(() => import('./views/dashboard/region/RegionForm'));
const Agencies = React.lazy(() => import('./views/dashboard/agency/Agencies'));
const AgencyForm = React.lazy(() => import('./views/dashboard/agency/AgencyForm'));
const AgencyDetails = React.lazy(() => import('./views/dashboard/agency/AgencyDetails'));
const Employees = React.lazy(() => import('./views/dashboard/employee/Employees'));
const EmployeeForm = React.lazy(() => import('./views/dashboard/employee/EmployeeForm'));
const EmployeeDetails = React.lazy(() => import('./views/dashboard/employee/EmployeeDetails'));
const Teams = React.lazy(() => import('./views/dashboard/team/Teams'));
const TeamForm = React.lazy(() => import('./views/dashboard/team/Teamform.js'));
const TeamDetails = React.lazy(() => import('./views/dashboard/team/TeamDetails'));
const Partners = React.lazy(() => import('./views/dashboard/partner/Partners'));
const PartnerForm = React.lazy(() => import('./views/dashboard/partner/PartnerForm'));
const PartnerDetails = React.lazy(() => import('./views/dashboard/partner/PartnerDetails'));
const Roles = React.lazy(() => import('./views/dashboard/role/Roles'));
const RoleForm = React.lazy(() => import('./views/dashboard/role/RoleForm'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const MyProfile = React.lazy(() => import('./views/dashboard/MyProfile/MyProfile'));
const Password = React.lazy(() => import('./views/dashboard/password/Password'));
const Orders = React.lazy(() => import('./views/dashboard/order/Orders'));
const OrderForm = React.lazy(() => import('./views/dashboard/order/OrderForm'));
const OrderForm2 = React.lazy(() => import('./views/dashboard/order/OrderForm2'));
const OrderDetails = React.lazy(() => import('./views/dashboard/order/OrderDetails'));
const Products = React.lazy(() => import('./views/dashboard/product/Products'));
const ProductForm = React.lazy(() => import('./views/dashboard/product/ProductForm'));
const ProductDetails = React.lazy(() => import('./views/dashboard/product/ProductDetails'));
const Categories = React.lazy(() => import('./views/dashboard/category/Categories'));
const CategoryForm = React.lazy(() => import('./views/dashboard/category/CategoryForm'));
const CategoryDetail = React.lazy(() => import('./views/dashboard/category/CategoryDetail'));
const Warehouses = React.lazy(() => import('./views/dashboard/warehouses/Warehouses'));
const WarehouseForm = React.lazy(() => import('./views/dashboard/warehouses/WarehouseForm'));
const WarehouseDetails = React.lazy(() => import('./views/dashboard/warehouses/WarehouseDetail'));
const ProductSales = React.lazy(() => import('./views/dashboard/sales/SalesOrder'));
const PrestashopOrders = React.lazy(() => import('./views/dashboard/sales/PrestashopOrders'));
const PrestashopOrderDetail = React.lazy(() => import('./views/dashboard/sales/PrestashopOrderDetail'))
const DelieveryDetails = React.lazy(() => import('./views/dashboard/sales/DelieveryDetails'))
const ViewPrestashopOrderDetails = React.lazy(() => import('./views/dashboard/sales/ViewPrestashopOrderDetails'))
const Adjustment = React.lazy(() => import('./views/dashboard/Adjustment/Adjustment'))
const PickOrder = React.lazy(() => import('./views/dashboard/sales/PickOrder'))
const StockCount = React.lazy(() => import('./views/dashboard/stockcounts/StockCount'))
const OrderToDeliver = React.lazy(() => import('./views/dashboard/sales/DeliveryOrders.js'))
const InventoryOrders = React.lazy(() => import('./views/dashboard/reports/InventoryOrdered.js'))
const ProductStock = React.lazy(() => import('./views/dashboard/reports/ProductStock.js'))
const AllOrders = React.lazy(() => import('./views/dashboard/sales/allOrders.js'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/employees/add', name: 'New Employee', component: EmployeeForm },
  { path: '/employees/edit', name: 'Edit Employee', component: EmployeeForm },
  { path: '/employees/:id', name: 'Employee Details', component: EmployeeDetails },
  { path: '/employees', name: 'Employees', component: Employees },
  { path: '/regions/add', name: 'New Region', component: RegionForm },
  { path: '/regions/edit', name: 'Edit Region', component: RegionForm },
  { path: '/regions', name: 'Regions', component: Regions },
  { path: '/agencies/add', name: 'New Agency', component: AgencyForm },
  { path: '/agencies/edit', name: 'Agency', component: AgencyForm },
  { path: '/agencies/:id', name: 'Agency Details', component: AgencyDetails },
  { path: '/agencies', name: 'Agencies', component: Agencies },
  { path: '/teams/add', name: 'New Team', component: TeamForm },
  { path: '/teams/edit', name: 'Teams', component: TeamForm },
  { path: '/teams/:id', name: 'Teams', component: TeamDetails },
  { path: '/teams', name: 'Teams', component: Teams },
  { path: '/partners/add', name: 'New Partner', component: PartnerForm },
  { path: '/partners/edit', name: 'Partners', component: PartnerForm },
  { path: '/partners/:id', name: 'Partners', component: PartnerDetails },
  { path: '/partners', name: 'Partners', component: Partners },
  { path: '/roles/add', name: 'New Role', component: RoleForm },
  { path: '/roles/edit', name: 'Update Role', component: RoleForm },
  { path: '/roles', name: 'Roles', component: Roles },
  { path: '/myprofile', name: 'MyProfile', component: MyProfile },
  { path: '/changepassword', name: 'Password', component: Password },
  { path: '/orders/add', name: 'New Order', component: OrderForm2 },
  // { path: '/orders/edit', name: 'Edit Order', component: OrderForm },
  { path: '/orders/edit', name: 'Edit Order', component: OrderForm2 },
  { path: '/orders/:id', name: 'Order Details', component: OrderDetails },
  { path: '/new/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/new', name: 'New Orders', component: Orders },
  { path: '/validated/:id', name: 'Orders Detail', component: OrderDetails },
  { path: '/validated', name: 'Validated Orders', component: Orders },
  { path: '/confirmed/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/confirmed', name: 'Confirmed Orders', component: Orders },
  { path: '/received/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/received', name: 'Received Orders', component: Orders },
  { path: '/stocked/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/stocked', name: 'Stocked Orders', component: Orders },
  { path: '/published/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/published', name: 'Published Orders', component: Orders },
  { path: '/cancelled/:id', name: 'Order Detail', component: OrderDetails },
  { path: '/cancelled', name: 'Cancelled Orders', component: Orders },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/products/add', name: 'New Product', component: ProductForm },
  { path: '/products/edit', name: 'Edit Product', component: ProductForm },
  { path: '/products/:id', name: 'Product Details', component: ProductDetails },
  { path: '/products', name: 'Products', component: Products },
  { path: '/categories/add', name: 'New Category', component: CategoryForm },
  { path: '/categories/edit', name: 'Edit Category', component: CategoryForm },
  { path: '/categories/:id', name: 'Category Detail', component: CategoryDetail },
  { path: '/categories', name: 'Categories', component: Categories },
  { path: '/warehouses/add', name: 'New Warehouse', component: WarehouseForm },
  { path: '/warehouses/edit', name: 'Edit Warehouse', component: WarehouseForm },
  { path: '/warehouses/:id', name: 'Warehouses', component: WarehouseDetails },
  { path: '/warehouses', name: 'Warehouses', component: Warehouses },
  { path: '/sales-orders/:id', name: 'Ecommerce Order Detail', component: ViewPrestashopOrderDetails },
  { path: '/sales-orders', name: 'Sales Orders', component: PrestashopOrders },
  { path: '/product-sales', name: 'Product Sales', component: ProductSales },
  { path: '/orderDetail/:id', name: 'Edit Ecommerce Order Detail', component: PrestashopOrderDetail },
  { path: '/pickOrder/:id', name: 'Delievery Detail', component: DelieveryDetails },
  { path: '/ordersToDeliver/:id', name: 'Delievery Detail', component: DelieveryDetails },
  { path: '/stock-counts/:id', name: 'Stock Count Detail', component: Adjustment },
  { path: '/pickOrder', name: 'Pick Order', component: PickOrder },
  { path: '/stock-counts', name: 'Stock Counts', component: StockCount },
  { path: '/ordersToDeliver', name: 'Orders To Deliver', component: OrderToDeliver },
  { path: '/ordered_inventory', name: 'Inventory Ordered', component: InventoryOrders },
  { path: '/product_stock', name: 'Products Stock', component: ProductStock },
  { path: '/all-prestashop-orders', name: 'All Orders', component: AllOrders },

];

export default routes;
