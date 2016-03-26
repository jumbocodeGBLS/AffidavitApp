class User < ActiveRecord::Base
  enum user_type: [:admin, :client]
end
