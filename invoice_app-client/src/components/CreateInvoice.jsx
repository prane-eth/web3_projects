const CreateInvoice = () => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-4">
					<div className="card card-body">
						<h3>Create Invoice</h3>
						<form onSubmit={addInvoice}>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									placeholder="Name"
									name="name"
									onChange={handleInputChange}
									value={invoice.name}
								/>
							</div>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									placeholder="Amount"
									name="amount"
									onChange={handleInputChange}
									value={invoice.amount}
								/>
							</div>
							<div className="form-group">
								<input
									type="date"
									className="form-control"
									placeholder="Date"
									name="date"
									onChange={handleInputChange}
									value={invoice.date}
								/>
							</div>
							<button className="btn btn-primary btn-block">
								Create
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateInvoice;
