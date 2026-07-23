import React from 'react';
import { Sale, ShopSettings } from '../types';

export const PrintView: React.FC<{
  sale?: Omit<Sale, 'id'>;
  sales?: Sale[];
  settings: ShopSettings | null;
  from?: string;
  to?: string;
  isConsolidated?: boolean;
}> = ({ sale, sales, settings, from, to, isConsolidated }) => {
  if (isConsolidated && sales) {
    let grandTotal = 0;
    return (
      <div style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#000', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          {settings?.receiptHeader && (
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
              {settings.receiptHeader.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
            </div>
          )}
          {!settings?.hideShopNameOnReceipt && (
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{settings?.name || "NAIL PRO BEAUTY STUDIO"}</div>
          )}
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>CONSOLIDATED SALES REPORT</div>
          {from && <div>From: {from}</div>}
          {to && <div>To: {to}</div>}
        </div>
        
        <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
        
        {sales.map((s, idx) => {
          grandTotal += s.total;
          let itemStaffNames: string[] = [];
          s.items.forEach(item => {
            if (item.staffAssignments && item.staffAssignments.length > 0) {
              itemStaffNames.push(...item.staffAssignments.map((a: any) => a.name));
            } else if (item.staffName) {
              itemStaffNames.push(item.staffName);
            }
          });
          const uniqueStaff = Array.from(new Set(itemStaffNames.filter(Boolean)));
          
          return (
            <React.Fragment key={idx}>
              <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Sale #{idx + 1}</div>
              <div style={{ marginBottom: '8px' }}>
                {!settings?.hideDateTimeOnReceipt && (
                  <div><strong>Time:</strong> {new Date(s.dateTime).toLocaleTimeString()}</div>
                )}
                {!settings?.hideStaffNameOnReceipt && (
                  uniqueStaff.length > 0 ? (
                    <div><strong>Staff:</strong> {uniqueStaff.join(', ')}</div>
                  ) : s.staff ? (
                    <div><strong>Staff:</strong> {s.staff}</div>
                  ) : null
                )}
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '50%', padding: '4px 0', borderBottom: '1px solid #000' }}>Item</th>
                    <th style={{ textAlign: 'center', width: '20%', padding: '4px 0', borderBottom: '1px solid #000' }}>Qty</th>
                    <th style={{ textAlign: 'right', width: '30%', padding: '4px 0', borderBottom: '1px solid #000' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {s.items.map((item, iIdx) => {
                    const sub = item.price * item.qty;
                    const netSub = sub - (sub * ((item.disP || 0) / 100));
                    return (
                      <tr key={iIdx}>
                        <td style={{ textAlign: 'left', padding: '4px 0', wordWrap: 'break-word', verticalAlign: 'top' }}>
                          {item.name}
                          {(item.disP || 0) > 0 && <><br/><small>(-{item.disP}%)</small></>}
                        </td>
                        <td style={{ textAlign: 'center', padding: '4px 0', verticalAlign: 'top' }}>{item.qty}</td>
                        <td style={{ textAlign: 'right', padding: '4px 0', verticalAlign: 'top' }}>{netSub.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>Sale Total</td>
                    <td style={{ textAlign: 'right', padding: '4px 0' }}>{s.total.toLocaleString()} Ks</td>
                  </tr>
                </tbody>
              </table>
              <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
            </React.Fragment>
          );
        })}
        
        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px', marginTop: '12px' }}>
          GRAND TOTAL: {grandTotal.toLocaleString()} Ks
        </div>
        <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
        {settings?.receiptFooter && (
          <div style={{ textAlign: 'center' }}>
            {settings.receiptFooter.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
          </div>
        )}
      </div>
    );
  } else if (sale) {
    let subTotal = 0;
    let totalDiscount = 0;
    
    let itemStaffNames: string[] = [];
    sale.items.forEach((item) => {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        itemStaffNames.push(...item.staffAssignments.map((a: any) => a.name));
      } else if (item.staffName) {
        itemStaffNames.push(item.staffName);
      }
    });
    const uniqueStaff = Array.from(new Set(itemStaffNames.filter(Boolean)));

    return (
      <div style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#000', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          {settings?.receiptHeader && (
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
              {settings.receiptHeader.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
            </div>
          )}
          {!settings?.hideShopNameOnReceipt && (
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{settings?.name || "NAIL PRO BEAUTY STUDIO"}</div>
          )}
          {settings?.addr && (
            <div style={{ marginBottom: '2px' }}>
              {settings.addr.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
            </div>
          )}
          {settings?.ph && <div>Ph: {settings.ph}</div>}
        </div>
        
        <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
        
        <div style={{ marginBottom: '8px' }}>
          {!settings?.hideDateTimeOnReceipt && (
            <div><strong>Date:</strong> {new Date(sale.dateTime).toLocaleString()}</div>
          )}
          {!settings?.hideStaffNameOnReceipt && (
            uniqueStaff.length > 0 ? (
              <div><strong>Staff:</strong> {uniqueStaff.join(', ')}</div>
            ) : sale.staff ? (
              <div><strong>Staff:</strong> {sale.staff}</div>
            ) : null
          )}
        </div>
        
        <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', width: '40%', padding: '4px 0', borderBottom: '1px solid #000' }}>Item</th>
              <th style={{ textAlign: 'center', width: '15%', padding: '4px 0', borderBottom: '1px solid #000' }}>Qty</th>
              <th style={{ textAlign: 'right', width: '20%', padding: '4px 0', borderBottom: '1px solid #000' }}>Price</th>
              <th style={{ textAlign: 'right', width: '25%', padding: '4px 0', borderBottom: '1px solid #000' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, idx) => {
              const sub = item.price * item.qty;
              const netSub = sub - (sub * ((item.disP || 0) / 100));
              subTotal += sub;
              totalDiscount += (sub - netSub);
              
              return (
                <tr key={idx}>
                  <td style={{ textAlign: 'left', padding: '6px 0', wordWrap: 'break-word', verticalAlign: 'top' }}>
                    {item.name}
                    {(item.disP || 0) > 0 && <><br/><small>(-{item.disP}%)</small></>}
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '6px 0', verticalAlign: 'top' }}>{item.price.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '6px 0', verticalAlign: 'top' }}>{netSub.toLocaleString()}</td>
                </tr>
              );
            })}
            <tr><td colSpan={4} style={{ borderTop: '1px dashed #000', paddingTop: '8px' }}></td></tr>
            
            {totalDiscount > 0 && (
              <>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>Sub Total</td>
                  <td style={{ textAlign: 'right', padding: '4px 0' }}>{subTotal.toLocaleString()} Ks</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>Total Discount</td>
                  <td style={{ textAlign: 'right', padding: '4px 0' }}>-{totalDiscount.toLocaleString()} Ks</td>
                </tr>
              </>
            )}
            
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan={3} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>NET TOTAL</td>
              <td style={{ textAlign: 'right', padding: '4px 0' }}>{sale.total.toLocaleString()} Ks</td>
            </tr>
            
            {!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed) && (
              <>
                {sale.pointsEarned ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>Points Earned</td>
                    <td style={{ textAlign: 'right', padding: '4px 0' }}>+{sale.pointsEarned}</td>
                  </tr>
                ) : null}
                {sale.pointsRedeemed ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', padding: '4px 0', paddingRight: '8px' }}>Points Redeemed</td>
                    <td style={{ textAlign: 'right', padding: '4px 0' }}>-{sale.pointsRedeemed}</td>
                  </tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
        
        <hr style={{ border: 0, borderTop: '1px dashed #000', margin: '8px 0' }} />
        
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          {(settings?.receiptFooter || "Thank You! Please Come Again").split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
        </div>
      </div>
    );
  }
  return null;
};
