<TableRow>
  <TableCell colSpan={6} className="bg-gray-50 border-t-0">
    <div className="py-4 px-2 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-gray-500 block mb-1">
            Current Balance
          </span>
          <span className="text-sm font-semibold">
            {formatCurrency(account.current_balance || 0, account.currency)}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Date Created</span>
          <span className="text-sm">{formatDate(account.created_at)}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block mb-1">Last Updated</span>
          <span className="text-sm">{formatDate(account.updated_at)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-gray-500 block mb-1">
            Parent Account
          </span>
          <span className="text-sm">{account.parent_account_id || "None"}</span>
        </div>
        <div className="md:col-span-2">
          <span className="text-xs text-gray-500 block mb-1">Description</span>
          <span className="text-sm">
            {account.description || "No description available"}
          </span>
        </div>
      </div>
    </div>
  </TableCell>
</TableRow>;
