interface OrdersSectionProps {
  orders: Array<{
    _id: string;
    date: string;
    total: number;
    items: Array<{ name: string; quantity: number }>;
  }>;
}

export default function OrdersSection({ orders }: OrdersSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Historial de compras</h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">
          (Aquí aparecerán tus pedidos recientes)
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-md">
              <div className="font-semibold">Pedido #{order._id}</div>
              <div>Fecha: {new Date(order.date).toLocaleDateString()}</div>
              <div>Total: ${order.total}</div>
              <div>Productos:</div>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
